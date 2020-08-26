'use strict';

const restart = require('../pm/restart');
const {shell, repo} = require('utils-mad');

/** @returns {Promise} */
module.exports = async () => {
    const logs = [];

    const repoUpdate = [
        'rpi-tools-bot', 'rpi-tools-cron',
        'magnet-co-parser', 'adguard-home-lists-my',
    ];

    for (const app of repoUpdate) {
        logs.push(
            `>>> ${app} <<<`,
            await repo.update(app),
        );
    }

    logs.push(
        '>>> global <<<',
        await shell.run('npm i -g $(npm -g outdated --parseable --depth=0 | cut -d: -f4)')
            || 'no updates',
    );

    logs.push(await restart());
    return logs;
};
