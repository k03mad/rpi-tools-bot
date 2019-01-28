'use strict';

const {printMsg} = require('../../utils');
const {shell} = require('utils-mad');

module.exports = query => shell.run(`pihole -q ${query}`).catch(err => printMsg(err));
