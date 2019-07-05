'use strict';

const appRoot = require('app-root-path');
const {promises: fs} = require('fs');

module.exports = async () => {
    const repos = ['rpi-tools-bot', 'rpi-tools-cron'];

    const logs = await Promise.all(
        repos.map(async elem => {
            const log = await fs.readFile(`${appRoot}/../${elem}/pm2.log`);
            return `${elem}\n\n${log.toString()}`;
        }),
    );

    return logs.join('\n---------\n');
};
