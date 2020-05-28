'use strict';

const restart = require('../pm/restart');
const {repo} = require('utils-mad');

/** @returns {Promise<Array>} */
module.exports = async () => {
    const logs = [];

    const apps = [
        'rpi-tools-bot', 'rpi-tools-cron', 'magnet-co-parser',
        'adguard-home-lists-my',
    ];

    for (const app of apps) {
        logs.push(await repo.update(app));
    }

    logs.push(await restart());

    return logs;
};
