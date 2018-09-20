const {run} = require('../../../utils');

/**
 * Install updates
 */
module.exports = () => run([
    'sudo apt-fast update',
    'sudo apt-fast upgrade -y',
    'sudo apt-fast autoremove -y',
    'sudo apt-fast autoclean',
], true);
