'use strict';

const {printMsg} = require('../../lib/utils');
const {runRepoScript} = require('../../lib/utils');
const {shell} = require('utils-mad');

module.exports = () => shell.run(runRepoScript(
    'adblock-hosts-list',
    'deploy && pihole -g'
)).catch(err => printMsg(err));
