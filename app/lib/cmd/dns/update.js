'use strict';

const {printMsg} = require('../../utils');
const {runRepoScript} = require('../../utils');
const {shell} = require('utils-mad');

module.exports = () => shell.run(runRepoScript(
    'adblock-hosts-list',
    'deploy && pihole -g'
)).catch(err => printMsg(err));
