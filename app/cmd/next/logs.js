'use strict';

const {next, hosts} = require('utils-mad');

/**
 * @param {string} domains
 * @param {string} sort
 * @param {number} pageRequests
 * @returns {Promise}
 */
module.exports = async (domains, sort = 'off', pageRequests = 20) => {
    if (domains !== '-' && domains !== '+') {
        return '/next_logs {type (-|+)} {sort (on|off)} {pages}';
    }

    const sortDomains = domainsSet => sort === 'on'
        ? hosts.comment(hosts.sort(new Set(domainsSet))).join('\n')
        : [...new Set(domainsSet)].reverse().join('\n');

    pageRequests = Number(pageRequests);

    const allowed = [];
    const blocked = [];

    let lastTime;

    for (let i = 1; i <= pageRequests; i++) {
        let method = 'push';

        if (i === pageRequests) {
            lastTime = '';
        }

        let {logs} = await next.query({
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

        logs.forEach(({status, name}) => {
            status === 2
                ? blocked[method](name)
                : allowed[method](name);
        });

        lastTime = logs[logs.length - 1].timestamp;
    }

    if (domains === '+') {
        return sortDomains(allowed);
    }

    return sortDomains(blocked);
};
