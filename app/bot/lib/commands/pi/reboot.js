const {run} = require('../../../../utils');

/**
 * Reboot RPi
 */
module.exports = () => run('sudo shutdown -r +1');
