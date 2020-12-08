'use strict';

const {next} = require('utils-mad');

/**
 * @param {number} pageRequests
 * @returns {Promise}
 */
module.exports = async (pageRequests = 30) => {
    const blocked = new Set();
    let lastTime;

    for (let i = 1; i <= Number(pageRequests); i++) {
        const {logs} = await next.get({
            path: 'logs',
            searchParams: {
                before: lastTime,
                simple: 1,
                lng: 'en',
            },
        });

        logs
            .filter(({lists}) => lists.length > 0)
            .forEach(({name}) => blocked.add(name));

        lastTime = logs[logs.length - 1].timestamp;
    }

    return [...blocked].join('\n');
};
