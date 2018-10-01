const {run, UFW_LOG} = require('../../../utils');

/**
 * Clean system log
 */
module.exports = async () => {
    await run(`sudo truncate -s 0 ${UFW_LOG}`);
    return 'System log cleaned';
};
