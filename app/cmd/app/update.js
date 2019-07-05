'use strict';

const {repo} = require('utils-mad');

module.exports = async () => {
    const repos = ['rpi-tools-bot', 'rpi-tools-cron'];
    const logs = [];

    for (const elem of repos) {
        const log = await repo.update(elem);
        logs.push(`${elem}\n\n${log}`);
    }

    return logs.join('\n---------\n');
};
