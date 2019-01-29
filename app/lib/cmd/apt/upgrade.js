'use strict';

const {log, shell} = require('utils-mad');

module.exports = () => shell.run([
    'sudo apt-get update',
    'sudo apt-get dist-upgrade -y',
    'sudo apt-get autoremove -y',
    'sudo apt-get autoclean',
]).catch(err => log.print(err));
