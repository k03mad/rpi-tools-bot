'use strict';

const {repo} = require('utils-mad');

module.exports = () => repo.run(
    'rpi-tools-cron',
    'task tools parse',
);
