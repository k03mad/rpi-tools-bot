const {run} = require('../../../utils');

/**
 * Get UFW logs
 */
module.exports = async () => {
    const log = await run('grep UFW /var/log/syslog');
    return log ? log : 'Log is empty';
};
