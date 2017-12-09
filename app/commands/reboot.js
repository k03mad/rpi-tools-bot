const run = require('../lib/utils');

/**
 * Reboot RPi3
 */
const reboot = async () => {
    await run('sudo reboot');
};

module.exports = reboot;
