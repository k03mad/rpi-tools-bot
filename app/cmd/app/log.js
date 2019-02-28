'use strict';

const appRoot = require('app-root-path');
const fs = require('fs');
const {log} = require('utils-mad');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

module.exports = async () => {
    try {
        const forever = await Promise.all([
            readFile(`${appRoot}/forever.log`),
            readFile(`${appRoot}/../rpi-tools-cron/forever.log`),
        ]);

        return forever.map(elem => elem.toString()).join('\n---------\n');
    } catch (err) {
        return log.print(err);
    }
};
