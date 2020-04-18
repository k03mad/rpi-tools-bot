'use strict';

const path = require('path');
const {promises: fs} = require('fs');

module.exports = () => fs.readFile(path.join(__dirname, '../../../../rpi-tools-cron/domains.log'), {encoding: 'utf-8'});
