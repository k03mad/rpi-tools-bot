const {promisify} = require('util');
const appRoot = require('app-root-path');
const fs = require('fs');

const readFile = promisify(fs.readFile);

/**
 * Get forever log
 */
const getLogMessage = async () => {
    try {
        const log = await readFile(`${appRoot}/forever.log`);
        return log.toString();
    } catch (ex) {
        return ex;
    }
};

module.exports = getLogMessage;
