const {run} = require('../../../utils');

/**
 * Get UFW logs
 */
module.exports = async () => {
    const log = await run('cat /var/log/ufw.log');
    return log ? log : 'Log is empty';
};
