'use strict';

const restart = require('../pm/restart');
const {shell, repo} = require('utils-mad');

const aptUpdate = [
    'update',
    'dist-upgrade -y',
    'autoremove -y',
    'clean',
];

const repoUpdate = [
    'rpi-tools-bot',
    'rpi-tools-cron',
    'magnet-co-parser',
];

/** @returns {Promise} */
module.exports = async () => {
    const logs = [];

    logs.push('__ APT __');

    for (const apt of aptUpdate) {
        logs.push(
            `>>> ${apt} <<<`,
            await shell.run(`sudo apt-get ${apt}`) || 'empty',
        );
    }

    logs.push('__ NPM __');

    const outdated = await shell.run('npm -g outdated --parseable --depth=0');
    const parsed = outdated
        .split(/\s+/)
        .map(elem => elem.split(':')[3])
        .filter(elem => !elem.startsWith('npm@'));

    if (parsed.length > 0) {
        logs.push(
            ...parsed.map(mod => `>>> ${mod} <<<`),
            await shell.run(`npm i -g ${parsed.join(' ')}`),
        );
    }

    logs.push('__ REPO __');

    for (const app of repoUpdate) {
        logs.push(
            `>>> ${app} <<<`,
            await repo.update(app),
        );
    }

    logs.push(await restart());

    return logs;
};
