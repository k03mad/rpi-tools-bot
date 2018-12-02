'use strict';

const appRoot = require('app-root-path');
const fs = require('fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

/**
 * Get forever log
 */
const getLogMessage = async () => {
    try {
        const log = await readFile(`${appRoot}/forever.log`);
        return log.length > 1 ? log.toString() : 'Log is empty';
    } catch (err) {
        return err.message;
    }
};

module.exports = getLogMessage;
