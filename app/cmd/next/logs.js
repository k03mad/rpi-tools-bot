'use strict';

const {next, hosts} = require('utils-mad');

/**
 * @param {string} domains
 * @param {string} sort
 * @param {number} pageRequests
 * @returns {Promise}
 */
module.exports = async (domains, sort = 'off', pageRequests = 20) => {
    if (!domains) {
        return '/next_logs {type (-|+|all)} {sort (on|off)} {pages (N)}';
    }

    const sortDomains = domainsSet => sort === 'on'
        ? hosts.comment(hosts.sort(new Set(domainsSet))).join('\n')
        : [...new Set(domainsSet)].join('\n');

    pageRequests = Number(pageRequests);

    const all = [];
    const allowed = [];
    const blocked = [];

    let lastTime;
    let method = 'push';

    for (let i = 1; i <= pageRequests; i++) {
        if (i === pageRequests) {
            lastTime = '';
        }

        let {logs} = await next.get({
            path: 'logs',
            searchParams: {
                before: lastTime || '',
                simple: 1,
                lng: 'en',
            },
        });

        if (i === pageRequests) {
            logs = logs.reverse();
            method = 'unshift';
        }

        // eslint-disable-next-line no-loop-func
        logs.forEach(({status, name}) => {
            if (status === 2) {
                all[method](`-.${name}`);
                blocked[method](name);
            } else {
                all[method](`+.${name}`);
                allowed[method](name);
            }
        });

        lastTime = logs[logs.length - 1].timestamp;
    }

    if (domains === '-') {
        return sortDomains(blocked);
    } else if (domains === '+') {
        return sortDomains(allowed);
    }

    return sortDomains(all);
};
