'use strict';

const restart = require('../pm/restart');
const {repo} = require('utils-mad');

module.exports = async () => [
    await repo.update('rpi-tools-bot'),
    await repo.update('rpi-tools-cron'),
    await repo.update('magnet-server'),
    await restart(),
];
