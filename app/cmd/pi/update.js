'use strict';

const {shell} = require('utils-mad');

/** @returns {Promise} */
module.exports = () => shell.run([
    'sudo apt-get update',
    'sudo apt-get dist-upgrade -y',
    'sudo apt-get autoremove -y',
    'sudo apt-get autoclean',
]);
