'use strict';

const {shell} = require('utils-mad');

module.exports = async () => {
    await shell.run('pm2 restart cron');
    await shell.run('pm2 restart magnet-server');
    shell.run('sleep 5 && pm2 restart bot');

    return 'restarting...';
};
