'use strict';

const {log, shell} = require('utils-mad');

module.exports = () => shell.run([
    'sudo apt update',
    'sudo apt full-upgrade -y',
    'sudo apt autoremove -y',
    'sudo apt autoclean',
]).catch(err => log.print(err));
