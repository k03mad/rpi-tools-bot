const {run} = require('../lib/utils');

/**
 * Reboot RPi
 */
const reboot = () => {
    return run('shutdown -r +1');
};

module.exports = reboot;
