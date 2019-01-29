'use strict';

const {log, shell} = require('utils-mad');

module.exports = query => shell.run(`pihole -q ${query}`).catch(err => log.print(err));
