'use strict';

const restart = require('../pm/restart');
const {repo, shell} = require('utils-mad');

/** @returns {Promise<Array>} */
module.exports = async () => {
    const logs = [];

    const apps = [
        'rpi-tools-bot', 'rpi-tools-cron',
        'magnet-co-parser', 'adguard-home-lists-my',
    ];

    for (const app of apps) {
        logs.push(
            `>>> ${app} <<<`,
            await repo.update(app),
        );
    }

    logs.push(
        '>>> global <<<',
        await shell.run('npm i -g $(npm -g outdated --parseable --depth=0 | cut -d: -f4)'),
    );

    logs.push(await restart());

    return logs;
};
