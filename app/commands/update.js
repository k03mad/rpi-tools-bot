const {run} = require('../lib/utils');

/**
 * Check for updates
 */
const update = () => {
    const cmd = [
        'sudo apt-get update',
        'sudo apt-get upgrade'
    ].join(' && ');

    return run(cmd);
};

module.exports = update;
