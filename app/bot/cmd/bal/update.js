const {runRepoScript} = require('../../../utils');
const {shell} = require('utils-mad');

module.exports = () => shell.run(runRepoScript('get-balance-providers', 'start'));
