'use strict';

const pMap = require('p-map');
const {cyan, dim} = require('colorette');
const {next, request, shell} = require('utils-mad');

/**
 * @returns {Promise}
 */
module.exports = async () => {
    const concurrency = 5;
    const lists = ['allowlist', 'denylist'];

    const [flushed, domains] = await Promise.all([
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
                    .filter(elem => elem.data.match(/(\d+.?){4}/))
                    .map(elem => elem.data)
                    .sort()
                    .join(', '))}`
                : `${domain} ${dim('no answer')}`;
        }, {concurrency}),

        pMap(domainsFlat, async domain => {
            const log = await shell.run(`dig ${domain} +short`);
            return log
                ? `${domain} ${dim(log
                    .split('\n')
                    .filter(elem => elem.match(/(\d+.?){4}/))
                    .sort()
                    .join(', '))}`
                : `${domain} ${dim('no answer')}`;
        }, {concurrency}),
    ]);

    return [
        flushed,
        '',
        cyan('DOH: '),
        doh,
        '',
        cyan('dig: '),
        dig,
    ].flat().join('\n');
};
