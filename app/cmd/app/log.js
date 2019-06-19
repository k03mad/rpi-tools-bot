'use strict';

const appRoot = require('app-root-path');
const fs = require('fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);
const repo = ['rpi-tools-bot', 'rpi-tools-cron', 'grammar-tlgrm-bot'];

module.exports = async () => {
    const forever = await Promise.all(
        repo.map(async elem => {
            const log = await readFile(`${appRoot}/../${elem}/forever.log`);
            return `${elem}\n\n${log.toString()}`;
        }),
    );

    return forever.join('\n---------\n');
};
