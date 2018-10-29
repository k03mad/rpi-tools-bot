const {run} = require('../../../utils');

module.exports = () => run([
    'sudo apt-get update',
    'sudo apt-get upgrade -y',
    'sudo apt-get autoremove -y',
    'sudo apt-get autoclean',
], {titles: true});
