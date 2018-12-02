'use strict';

const {runRepoScript} = require('../../lib/utils');
const {shell} = require('utils-mad');

module.exports = () => shell.run(runRepoScript(
    'adblock-hosts-list',
    'check'
)).catch(err => err);
