'use strict';

const {shell} = require('utils-mad');

module.exports = () => shell.run([
    'sudo apt-get update > /dev/null',
    'apt-get upgrade -u -s',
]);
