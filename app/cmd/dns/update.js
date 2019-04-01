'use strict';

const {shell} = require('utils-mad');

module.exports = () => shell.script(
    'adblock-hosts-list',
    'deploy && pihole -g'
);
