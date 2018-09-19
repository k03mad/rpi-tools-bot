const {run} = require('../../../../utils');

/**
 * Install updates
 */
const upgrade = () => run([
    'sudo apt-fast update',
    'sudo apt-fast upgrade -y',
    'sudo apt-fast autoremove -y',
    'sudo apt-fast autoclean',
]);

module.exports = upgrade;
