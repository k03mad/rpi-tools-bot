const {every} = require('schedule');
const c = require('require-all')(`${__dirname}/lib`);

/**
 * Bot crons
 */
const cron = bot => {
    every('1m').do(() => c.sensorsData(bot));

    every('2m').do(() => c.statsTemp());
    every('2m').do(() => c.statsUsage());

    every('5m').do(() => c.wifiDevices(bot));

    every('10m').do(() => c.dnsQueries());
    every('10m').do(() => c.dnsTop());

    every('15m').do(() => c.lastfm());

    every('1h').do(() => c.adblockErrors());

    every('5h').do(() => c.raspUpdate(bot));
};

module.exports = cron;
