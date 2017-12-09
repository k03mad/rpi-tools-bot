const {run} = require('../lib/utils');

/**
 * Get local network device list
 */
const arp = () => {
    return run('arp -a');
};

module.exports = arp;
