'use strict';

const {printMsg} = require('../../lib/utils');
const {shell} = require('utils-mad');

module.exports = () => shell.run('sudo shutdown -h +1').catch(err => printMsg(err));
