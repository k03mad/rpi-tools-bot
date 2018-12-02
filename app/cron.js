'use strict';

const b = require('require-all')(`${__dirname}/cmd`);
const cron = require('node-cron');

/**
 * Schedule crons
 * @param {Object} bot telegram node api
 */
const run = bot => {

    cron.schedule('0 * * * *', () => b.dns.update());

    cron.schedule('0 20 * * *', () => {
        b.apt.update(bot);
        b.dns.lastpush(bot);
    });

    cron.schedule('0 5 * * *', () => b.pi.reboot());
    cron.schedule('30 5 * * *', () => b.wifi.reboot());

};

module.exports = run;
