const {run} = require('../lib/utils');

/**
 * Shutdown RPi
 */
const shutdown = () => {
    return run('sudo shutdown -h +1');
};

module.exports = shutdown;
