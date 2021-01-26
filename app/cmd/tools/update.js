'use strict';

const restart = require('../pm/restart');
const {shell, repo} = require('utils-mad');

/** @returns {Promise} */
module.exports = async () => {
    // const logs = [];

    // const repoUpdate = [
    //     'rpi-tools-bot',
    //     'rpi-tools-cron',
    //     'magnet-co-parser',
    // ];

    // for (const app of repoUpdate) {
    //     logs.push(
    //         `>>> ${app} <<<`,
    //         await repo.update(app),
    //     );
    // }

    const outdated = await shell.run('npm -g outdated --parseable --depth=0');
    console.log(':: -----------------------');
    console.log(':: > outdated', outdated);
    console.log(':: -----------------------');
    // logs.push(
    //     '>>> global <<<',
    //     // eslint-disable-next-line no-template-curly-in-string
    //     await shell.run("npm -g outdated --parseable --depth=0 | pjs --after \"LINES.map(elem => elem.split(':')[3]).filter(elem => elem.startsWith('npm@') === false).join(' ')\" | xargs -t npm i -g")
    //         || 'no updates',
    // );

    // logs.push(await restart());
    // return logs;
    return '1';
};
