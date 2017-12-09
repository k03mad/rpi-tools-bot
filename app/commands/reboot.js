const run = require('../lib/utils');

/**
 * Reboot RPi3
 */
const reboot = async () => {
    await run('reboot');
};

module.exports = reboot;
