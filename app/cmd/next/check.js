'use strict';

const hexyjs = require('hexyjs');
const pMap = require('p-map');
const {cyan, dim, yellow, magenta} = require('colorette');
const {mikrotik} = require('../../../env');
const {next, request, shell, promise} = require('utils-mad');

const getList = async path => {
    const list = await next.query({path});
    return list.map(({domain}) => domain);
};

/** @returns {Promise} */
module.exports = async () => {
    const ip = /(\d{1,3}\.){3}\d{1,3}/;
    const noAnswer = dim('no answer');

    const lists = ['allowlist', 'denylist'];

    const concurrency = 2;
    const pause = 5000;

    const message = [];

    for (const list of lists) {
        await shell.run('mad-mik-dns flush');
        const domains = (await getList(list)).flat();

        if (domains.length > 0) {
            // disable personal filters
            await pMap(domains, domain => next.query({
                method: 'PATCH',
                path: `${list}/hex:${hexyjs.strToHex(domain)}`,
                json: {active: false},
            }), {concurrency});

            await promise.delay(pause);

            // get dns records: from other doh-service and from current machine dig
            const [doh, dig] = await Promise.all([
                pMap(domains, async domain => {
                    const {Answer} = await request.doh(domain);
                    return Answer
                        ? `— ${domain} ${dim(Answer
                            .filter(elem => elem.data.match(ip))
                            .map(elem => elem.data)
                            .sort()
                            .pop())}`
                        : `!! ${domain} ${noAnswer}`;
                }, {concurrency}),

                pMap(domains, async domain => {
                    const log = await shell.run(`dig @${mikrotik.host} ${domain} +short`);
                    return log
                        ? `— ${domain} ${dim(log
                            .split('\n')
                            .filter(elem => elem.match(ip))
                            .sort()
                            .pop())}`
                        : `!! ${domain} ${noAnswer}`;
                }, {concurrency}),
            ]);

            await promise.delay(pause);

            // get last requsts logs
            const {logs} = await next.query({
                path: 'logs',
                searchParams: {simple: 1, lng: 'en'},
            });

            // save list from allow/block reasons
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
                '',
                cyan('DOH: '),
                doh,
                '',
                cyan('dig: '),
                dig,
            );

            if (foundInLists.length > 0) {
                message.push(
                    '',
                    magenta('REASONS:'),
                    foundInLists,
                );
            }
        }
    }

    return message.flat().join('\n').trim();
};
