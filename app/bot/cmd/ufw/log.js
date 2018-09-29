const {run} = require('../../../utils');

/**
 * Get UFW logs
 */
module.exports = () => run('grep UFW /var/log/syslog');
