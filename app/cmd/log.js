const {msg} = require('../lib/messages');
const {promisify} = require('util');
const appRoot = require('app-root-path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

/**
 * Get forever log
 */
const getLogMessage = async () => {
    const logfile = `${appRoot}/forever.log`;

    try {
        const log = await readFile(logfile);

        return log.length > 1 ? log.toString() : msg.common.emptyLog;
    } catch (err) {
        return err.message;
    }
};

module.exports = getLogMessage;
