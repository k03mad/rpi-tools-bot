'use strict';

const {next} = require('utils-mad');

/**
 * @param {string} domains
 * @param {number} pageRequests
 * @returns {Promise}
 */
module.exports = async (domains = '-', pageRequests = 30) => {
    const all = new Set();
    const allowed = new Set();
    const blocked = new Set();

    let lastTime;

    for (let i = 1; i <= Number(pageRequests); i++) {
        const {logs} = await next.get({
            path: 'logs',
            searchParams: {
                before: lastTime || '',
                simple: 1,
                lng: 'en',
            },
        });

        logs.forEach(({lists, name}) => {
            if (lists.length > 0) {
                all.add(`- ${name}`);
                blocked.add(name);
            } else {
                all.add(`+ ${name}`);
                allowed.add(name);
            }
        });

        lastTime = logs[logs.length - 1].timestamp;
    }

    if (domains === '-') {
        return [...blocked].join('\n');
    } else if (domains === '+') {
        return [...allowed].join('\n');
    }

    return [...all].join('\n');
};
