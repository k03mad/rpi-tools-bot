'use strict';

const restart = require('../pm/restart');
const {shell, repo} = require('utils-mad');

/** @returns {Promise} */
module.exports = async () => {
    const logs = [];

    const repoUpdate = [
        'rpi-tools-bot',
        'rpi-tools-cron',
        'magnet-co-parser',
    ];

    for (const app of repoUpdate) {
        logs.push(
            `>>> ${app} <<<`,
            await repo.update(app),
        );
    }

    const outdated = await shell.run('npm -g outdated --parseable --depth=0');
    const modules = outdated
        .split(/\s+/)
        .map(elem => elem.split(':')[3])
        .filter(elem => !elem.startsWith('npm@'))
        .join(' ');

    if (modules) {
        logs.push(
            `>>> ${modules} <<<`,
            await shell.run(`npm i -g ${modules}`),
        );
    }

    logs.push(await restart());
    return logs;
};
