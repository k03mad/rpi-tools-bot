'use strict';

const flush = require('./flush');
const {shell} = require('utils-mad');

module.exports = async () => {
    const logs = [];
    logs.push(
        await shell.run('pm2 restart all'),
        await flush(),
    );
    return logs;
};
