'use strict';

const {log, shell} = require('utils-mad');
const {runRepoScript} = require('../../lib/utils');

module.exports = () => shell.run(runRepoScript(
    'adblock-hosts-list',
    'deploy && pihole -g'
)).catch(err => log.print(err));
