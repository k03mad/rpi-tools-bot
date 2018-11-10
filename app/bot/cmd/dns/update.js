const {runRepoScript} = require('../../../utils');
const {shell} = require('utils-mad');

module.exports = async () => {
    await shell.run(runRepoScript('adblock-hosts-list', 'deploy'));
    await shell.run('pihole -g');
};
