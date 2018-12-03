'use strict';

const {printMsg} = require('../../lib/utils');
const {shell} = require('utils-mad');

module.exports = () => shell.run([
    'sudo apt-get update',
    'sudo apt-get upgrade -y',
    'sudo apt-get autoremove -y',
    'sudo apt-get autoclean',
]).catch(err => printMsg(err));
