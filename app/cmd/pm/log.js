'use strict';

const {shell} = require('utils-mad');

module.exports = () => shell.run('pm2 logs --nostream --lines 30');
