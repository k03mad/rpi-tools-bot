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
        // eslint-disable-next-line no-template-curly-in-string
        await shell.run('for package in $(npm -g outdated --parseable --depth=0 | cut -d: -f4); do npm i ${package} -g; done')
            || 'no updates',
    );

    logs.push(await restart());

    return logs;
};
