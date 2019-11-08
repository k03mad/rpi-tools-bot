'use strict';

const {repo} = require('utils-mad');

module.exports = () => repo.run(
    'rpi-tools-cron',
    'task dns update',
    'DEBUG=utils-mad*',
);
