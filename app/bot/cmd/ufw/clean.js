const {run} = require('../../../utils');

/**
 * Clean system log
 */
module.exports = async () => {
    await run('sudo truncate -s 0 /var/log/ufw.log');
    return 'System log cleaned';
};
