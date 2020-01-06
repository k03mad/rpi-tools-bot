'use strict';

const moment = require('moment');
const {adg} = require('utils-mad');

module.exports = async () => {
    const {data} = await adg.query('querylog');
    const domains = {};

    data.forEach(elem => {
        if (!domains[elem.question.host]) {
            domains[elem.question.host] = elem.reason + moment(elem.time).format('HH:mm');
        }
    });

    const message = [];

    for (const [key, value] of Object.entries(domains)) {
        let valueChar = value;

        if (value.startsWith('NotFilteredNotFound')) {
            valueChar = value.replace('NotFilteredNotFound', '  ');
        }

        if (value.startsWith('FilteredBlackList')) {
            valueChar = value.replace('FilteredBlackList', '- ');
        }

        if (value.startsWith('NotFilteredWhiteList')) {
            valueChar = value.replace('NotFilteredWhiteList', '+ ');
        }

        message.push(`${valueChar} ${key}`);
    }

    return message.reverse().join('\n');
};
