'use strict';

const appRoot = require('app-root-path');
const fs = require('fs');
const {printMsg} = require('../../utils');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

module.exports = async () => {
    try {
        const log = await Promise.all([
            readFile(`${appRoot}/forever.log`),
            readFile(`${appRoot}/../rpi-tools-cron/forever.log`),
        ]);

        return log.map(elem => elem.toString()).join('\n---------\n');
    } catch (err) {
        return printMsg(err);
    }
};
