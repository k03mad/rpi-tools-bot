const {every} = require('schedule');
const c = require('require-all')(`${__dirname}/lib`);
const dnsUpdate = require('../bot/lib/commands/dns/update');

/**
 * Schedule crons
 * @param {Object} bot telegram node api
 */
const cron = bot => {
    every('1m').do(() => c.pi.usage());

    every('5m').do(() => c.dns.clients());
    every('5m').do(() => c.dns.queries());
    every('5m').do(() => c.dns.top());

    every('1h').do(() => dnsUpdate());
    every('5h').do(() => c.pi.update(bot));
};

module.exports = cron;
