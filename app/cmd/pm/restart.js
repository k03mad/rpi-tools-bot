'use strict';

const {shell} = require('utils-mad');

module.exports = async () => {
    const allApps = ['magnet-server', 'cron'];
    const currentApps = ['bot'];

    for (const app of allApps) {
        await shell.run(`pm2 restart ${app}`);
    }

    for (const app of currentApps) {
        shell.run(`sleep 5 && pm2 restart ${app}`);
    }

    return `restarting apps: ${[...allApps, ...currentApps].join(', ')}...`;
};
