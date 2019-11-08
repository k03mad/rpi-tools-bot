'use strict';

const {repo} = require('utils-mad');

module.exports = async () => {
    const logs = [];

    logs.push(await repo.run('adblock-hosts-list', 'deploy'));
    logs.push(await repo.run('rpi-tools-cron', 'task dns update'));

    return logs.join('\n\n');
};
