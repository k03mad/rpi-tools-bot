'use strict';

const {shell} = require('@k03mad/utils');

/** @returns {Promise<string>} */
module.exports = async () => {
    const log = await shell.run('pm2 logs --nostream --lines 100');
    return log.replace(/\[TAILING][\S\s]+?\n\n/, '');
};
