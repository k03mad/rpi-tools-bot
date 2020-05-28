'use strict';

const {shell} = require('utils-mad');

/** @returns {Promise<string>} */
module.exports = async () => {
    const allApps = ['magnet-co-parser', 'cron'];
    const currentApps = ['bot'];

    for (const app of allApps) {
        await shell.run(`pm2 restart ${app} --update-env`);
    }

    for (const app of currentApps) {
        shell.run(`sleep 5 && pm2 restart ${app} --update-env`);
    }

    return `restarting apps: ${[...allApps, ...currentApps].join(', ')}...`;
};
