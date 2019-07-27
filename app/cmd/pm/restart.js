'use strict';

const flush = require('./flush');
const {shell} = require('utils-mad');

module.exports = async () => [
    await shell.run('pm2 restart all'),
    await flush(),
];
