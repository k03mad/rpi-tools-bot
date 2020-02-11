'use strict';

const {promises: fs} = require('fs');

module.exports = () => fs.readFile('../../../../rpi-tools-cron/domains.log', {encoding: 'utf-8'});
