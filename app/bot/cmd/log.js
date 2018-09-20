const {promisify} = require('util');
const appRoot = require('app-root-path');
const fs = require('fs');
const msg = require('../../errors');

const readFile = promisify(fs.readFile);

/**
 * Get forever log
 */
const getLogMessage = async () => {
    try {
        const log = await readFile(`${appRoot}/forever.log`);
        return log.length > 1 ? log.toString() : msg.common.emptyLog;
    } catch (err) {
        return err.message;
    }
};

module.exports = getLogMessage;
