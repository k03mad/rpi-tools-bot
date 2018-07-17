const {every} = require('schedule');
const c = require('require-all')(`${__dirname}/lib`);

/**
 * Schedule crons
 * @param {Object} bot telegram node api
 */
const cron = bot => {
    every('1m').do(() => c.pi.temp());
    every('1m').do(() => c.pi.usage());
    every('1m').do(() => c.router.devices(bot));
    every('1m').do(() => c.sensors.weather(bot));

    every('5m').do(() => c.air.quality());
    every('5m').do(() => c.dns.queries());
    every('5m').do(() => c.dns.top());
    every('5m').do(() => c.router.traffic());

    every('10m').do(() => c.lastfm.top());
    every('10m').do(() => c.yahoo.weather());

    every('30m').do(() => c.myshows.episodes());

    every('55m').do(() => c.dns.domains());
    every('60m').do(() => c.adblock.errors());

    every('5h').do(() => c.pi.update(bot));
};

module.exports = cron;
