'use strict';

const {next} = require('utils-mad');

/**
 * @param {string} domains
 * @param {number} pageRequests
 * @returns {Promise}
 */
module.exports = async (domains = '-', pageRequests = 20) => {
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
                all[method](`- ${name}`);
                blocked[method](name);
            } else {
                all[method](`+ ${name}`);
                allowed[method](name);
            }
        });

        lastTime = logs[logs.length - 1].timestamp;
    }

    if (domains === '-') {
        return [...new Set(blocked)].join('\n');
    } else if (domains === '+') {
        return [...new Set(allowed)].join('\n');
    }

    return [...new Set(all)].join('\n');
};
