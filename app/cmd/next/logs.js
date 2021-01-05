'use strict';

const {next, hosts} = require('utils-mad');

/**
 * @param {string} domains
 * @param {string} sort
 * @param {number} pages
 * @returns {Promise}
 */
module.exports = async (domains, sort = 'on', pages = 100) => {
    if (domains !== '-' && domains !== '+') {
        return '/next_logs {type (-|+)} {sort (on|off = on)} {pages = 100}';
    }

    const sortDomains = domainsSet => sort === 'on'
        ? hosts.comment(hosts.sort(new Set(domainsSet))).join('\n')
        : [...new Set(domainsSet)].reverse().join('\n');

    pages = Number(pages);

    const allowed = [];
    const blocked = [];

    let lastTime;

    for (let i = 1; i <= pages; i++) {
        let method = 'push';

        if (i === pages) {
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

        if (i === pages) {
            logs = logs.reverse();
            method = 'unshift';
        }

        logs.forEach(({status, name, deviceName}) => {
            if (deviceName !== 'Mad-Checker') {
                status === 2
                    ? blocked[method](name)
                    : allowed[method](name);
            }
        });

        lastTime = logs[logs.length - 1].timestamp;
    }

    if (domains === '+') {
        return sortDomains(allowed);
    }

    return sortDomains(blocked);
};
