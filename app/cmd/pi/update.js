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

    const aptUpdate = [
        'sudo apt-get update',
        'sudo apt-get dist-upgrade -y',
        'sudo apt-get autoremove -y',
        'sudo apt-get autoclean',
    ];

    for (const app of repoUpdate) {
        logs.push(
            `>>> node :: ${app} <<<`,
            await repo.update(app),
        );
    }

    logs.push(
        '>>> node :: global <<<',
        // eslint-disable-next-line no-template-curly-in-string
        await shell.run('for package in $(npm -g outdated --parseable --depth=0 | cut -d: -f4); do npm i ${package} -g; done')
            || 'no updates',
    );

    for (const apt of aptUpdate) {
        logs.push(
            `>>> apt :: ${apt.split(' ')[2]} <<<`,
            await shell.run(apt),
        );
    }

    logs.push(await restart());
    return logs;
};
