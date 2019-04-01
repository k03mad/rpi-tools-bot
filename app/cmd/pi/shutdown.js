'use strict';

const {shell} = require('utils-mad');

module.exports = () => shell.run('sudo shutdown -h +1');
