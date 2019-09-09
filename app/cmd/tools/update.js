'use strict';

const restart = require('../pm/restart');
const {repo} = require('utils-mad');

module.exports = async () => {
    const apps = ['rpi-tools-bot', 'rpi-tools-cron', 'magnet-server'];
    const logs = [];

    for (const app of apps) {
        logs.push(await repo.update(app));
    }

    logs.push(await restart());
    return logs;
};