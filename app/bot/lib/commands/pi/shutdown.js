const {run} = require('../../../../utils');

/**
 * Shutdown RPi
 */
const shutdown = () => {
    return run('sudo shutdown -h +1');
};

module.exports = shutdown;
