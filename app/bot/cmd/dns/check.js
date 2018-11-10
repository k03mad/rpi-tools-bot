const {runRepoScript} = require('../../../utils');
const {shell} = require('utils-mad');

module.exports = () => shell.run(runRepoScript('adblock-hosts-list', 'check'));
