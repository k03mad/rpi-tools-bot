'use strict';

const moment = require('moment');
const {adg} = require('utils-mad');

module.exports = async () => {
    const {data} = await adg.query('querylog');
    const domains = {};

    data.forEach(elem => {
        if (!domains[elem.question.host]) {
            domains[elem.question.host] = elem.status + moment(elem.time).format('HH:mm');
        }
    });

    const message = [];

    for (const [key, value] of Object.entries(domains)) {
        let valueChar = value;

        if (value.startsWith('NOERROR')) {
            valueChar = value.replace('NOERROR', '  ');
        }

        if (value.startsWith('NXDOMAIN')) {
            valueChar = value.replace('NXDOMAIN', '- ');
        }

        message.push(`${valueChar} ${key}`);
    }

    return message.reverse().join('\n');
};
