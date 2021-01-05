'use strict';

const env = require('../../../env');
const hexyjs = require('hexyjs');
const pMap = require('p-map');
const {cyan, dim, yellow} = require('colorette');
const {next, request, promise, hosts} = require('utils-mad');

const getList = async path => {
    const list = await next.query({path});
    return list.map(({domain}) => domain);
};

const prepareAnswer = (domain, Answer) => Answer
    ? `— ${domain} ${dim(Answer
        .filter(elem => elem.data.match(/(\d{1,3}\.){3}\d{1,3}/))
        .map(elem => elem.data)
        .sort()
        .pop())}`
    : `!! ${domain} ${dim('no answer')}`;

const pushRecords = (message, arr, name) => {
    if (arr.length > 0) {
        message.push(
            '',
            cyan(`${name}:`),
            arr,
        );
    }
};

/** @returns {Promise} */
module.exports = async () => {
    const lists = ['allowlist', 'denylist'];

    const concurrency = 4;
    const pause = 5000;

    const message = [];

    for (const list of lists) {
        const domains = (await getList(list)).flat();

        if (domains.length > 0) {
            // disable personal filters
            await pMap(domains, domain => next.query({
                method: 'PATCH',
                path: `${list}/hex:${hexyjs.strToHex(domain)}`,
                json: {active: false},
            }), {concurrency});

            await promise.delay(pause);

            // get dns records
            const cloudflare = [];
            const nextdns = [];
            const common = [];

            await pMap(domains, async domain => {
                let Answer;

                ({Answer} = await request.doh({domain}));
                const preparedDef = prepareAnswer(domain, Answer);

                ({Answer} = await request.doh({domain, resolver: `https://dns.nextdns.io/${env.next.config}/Mad-Checker`}));
                const preparedNext = prepareAnswer(domain, Answer);

                if (preparedDef === preparedNext) {
                    common.push(preparedDef);
                } else {
                    cloudflare.push(preparedDef);
                    nextdns.push(preparedNext);
                }
            }, {concurrency});

            await promise.delay(pause);

            // get last requests logs
            const {logs} = await next.query({
                path: 'logs',
                searchParams: {simple: 1, lng: 'en'},
            });

            // save allow/block reasons
            const foundInLists = [];

            domains.forEach(domain => {
                const lastDomainLog = logs.find(elem => elem.name === domain);

                if (lastDomainLog?.lists.length > 0) {
                    foundInLists.push(`— ${domain} ${dim(lastDomainLog.lists.join(', '))}`);
                }
            });

            // reenable filters
            await pMap(domains, domain => next.query({
                method: 'PATCH',
                path: `${list}/hex:${hexyjs.strToHex(domain)}`,
                json: {active: true},
            }), {concurrency});

            message.push(
                '',
                yellow(`__${list.toUpperCase()}__`),
            );

            pushRecords(message, cloudflare, 'cloudflare');
            pushRecords(message, nextdns, 'nextdns');
            pushRecords(message, common, 'common');
            pushRecords(message, foundInLists, 'reasons');
        }
    }

    return message.flat().join('\n').trim();
};
