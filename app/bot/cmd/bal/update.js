const {run, runRepoScript} = require('../../../utils');

module.exports = () => run(
    runRepoScript('get-balance-providers', 'start')
);
