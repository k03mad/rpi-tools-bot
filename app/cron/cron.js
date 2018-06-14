const {every} = require('schedule');
const c = require('require-all')(`${__dirname}/lib`);

/**
 * Schedule crons
 * @param {Object} bot telegram node api
 */
const cron = bot => {
    every('1m').do(() => c.sensors.weather(bot));
    every('1m').do(() => c.yahoo.weather());

    every('1m').do(() => c.pi.temp());
    every('1m').do(() => c.pi.usage());
    every('5h').do(() => c.pi.update(bot));

    every('1m').do(() => c.router.devices(bot));
    every('1m').do(() => c.router.traffic());

    every('1m').do(() => c.dns.queries());
    every('1m').do(() => c.dns.top());

    every('1m').do(() => c.lastfm.top());

    every('1h').do(() => c.adblock.errors());
};

module.exports = cron;
