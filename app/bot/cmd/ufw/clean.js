const {run} = require('../../../utils');

/**
 * Clean system log
 */
module.exports = async () => {
    await run('sudo truncate -s 0 /var/log/syslog');
    return 'System log cleaned';
};
