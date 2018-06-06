const {run} = require('../../../../utils');

/**
 * Shutdown RPi
 */
module.exports = () => run('sudo shutdown -h +1');
