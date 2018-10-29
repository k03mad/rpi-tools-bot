const {run, runRepoScript} = require('../../../utils');

module.exports = () => run([
    runRepoScript('adblock-hosts-list', 'deploy'),
    'pihole -g',
], {
    titles: true,
});
