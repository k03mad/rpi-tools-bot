'use strict';

const pMap = require('p-map');
const {cyan, dim} = require('colorette');
const {mikrotik} = require('../../../env');
const {next, request, shell} = require('utils-mad');

/**
 * @returns {Promise}
 */
module.exports = async () => {
    const ip = /(\d+.?){4}/;
    const noAnswer = dim('no answer');

    const lists = ['allowlist', 'denylist'];
    const concurrency = 5;

    const [, domains] = await Promise.all([
        shell.run('mad-mik-dns flush'),

        Promise.all(lists.map(async path => {
            const list = await next.query({path});
            return list.map(({domain}) => domain);
        })),
    ]);

    const domainsFlat = domains.flat();

    const [doh, dig] = await Promise.all([
        pMap(domainsFlat, async domain => {
            const {Answer} = await request.doh(domain);
            return Answer
                ? `${domain} ${dim(Answer
                    .filter(elem => elem.data.match(ip))
                    .map(elem => elem.data)
                    .sort()
                    .join(', '))}`
                : `${domain} ${noAnswer}`;
        }, {concurrency}),

        pMap(domainsFlat, async domain => {
            const log = await shell.run(`dig @${mikrotik.host} ${domain} +short`);
            return log
                ? `${domain} ${dim(log
                    .split('\n')
                    .filter(elem => elem.match(ip))
                    .sort()
                    .join(', '))}`
                : `${domain} ${noAnswer}`;
        }, {concurrency}),
    ]);

    return [
        cyan('DOH: '),
        doh,
        '',
        cyan('dig: '),
        dig,
    ].flat().join('\n');
};
