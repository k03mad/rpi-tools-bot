'use strict';

const {shell} = require('utils-mad');

module.exports = query => shell.run(`pihole -q ${query}`);
