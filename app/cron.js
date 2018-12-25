'use strict';

const b = require('require-all')(`${__dirname}/cmd`);
const cron = require('node-cron');

/**
 * Schedule crons
 * @param {Object} bot telegram node api
 */
const run = bot => {

    cron.schedule('0 * * * *', () => b.dns.update());

    cron.schedule('0 20 * * *', async () => {
        await b.apt.update(bot);
        await b.dns.lastpush(bot);
    });

    cron.schedule('30 5 * * *', () => b.pi.reboot());

};

module.exports = run;
