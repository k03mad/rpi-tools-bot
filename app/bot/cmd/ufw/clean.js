const {shell} = require('utils-mad');
const {UFW_LOG} = require('../../../utils');

/**
 * Clean system log
 */
module.exports = async () => {
    await shell.run(`sudo truncate -s 0 ${UFW_LOG}`);
    return 'System log cleaned';
};
