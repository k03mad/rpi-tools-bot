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
        const log = await repo.update(app);
        logs.push(`>>> ${app} <<<`, log);
    }

    // eslint-disable-next-line no-template-curly-in-string
    const npm = await shell.run('for package in $(npm -g outdated --parseable --depth=0 | cut -d: -f4); do if [[ ! ${package} =~ ^npm@ ]]; then echo "➡️  ${package}" && npm i -g ${package}; fi; done');
    const pnpm = await shell.run('pnpm i $(pnpm outdated -g --no-table | cut -d\' \' -f 3 | tr \'\n\' \'@\' | sed -r \'s/@@|@$/ /g\') -g');

    logs.push(
        '>>> npm <<<', npm,
        '>>> pnpm <<<', pnpm,
    );

    const log = await restart();
    logs.push('>>> restart <<<', log);

    return logs;
};
