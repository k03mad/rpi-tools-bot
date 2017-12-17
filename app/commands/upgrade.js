const {run} = require('../lib/utils');

/**
 * Install updates
 */
const upgrade = () => {
    const cmd = [
        'sudo apt-get update',
        'sudo apt-get upgrade -y',
        'sudo apt-get autoremove',
        'sudo apt-get autoclean'
    ].join(' && ');

    return run(cmd);
};

module.exports = upgrade;
