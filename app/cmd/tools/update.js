'use strict';

const restart = require('../pm/restart');
const {shell, repo} = require('@k03mad/utils');

const repoUpdate = [
    'rpi-tools-bot',
    'rpi-tools-cron',
    'magnet-co-parser',
    'nextdns-lists-sync',
];

/** @returns {Promise} */
module.exports = async () => {
    const logs = ['__ NPM __'];

    const outdated = await shell.run('npm -g outdated --parseable --depth=0');
    const parsed = outdated
        .split(/\s+/)
        .map(elem => elem.split(':')[3])
        .filter(Boolean);

    if (parsed.length > 0) {

        for (const pkg of parsed) {
            let output;

            try {
                output = await shell.run(`npm i -g ${pkg}`);
            } catch (err) {
                output = err;
            }

            logs.push(
                `>>> ${pkg} <<<`,
                output,
            );
        }

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
