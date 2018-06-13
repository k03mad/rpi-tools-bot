const {every} = require('schedule');
const c = require('require-all')(`${__dirname}/lib`);

/**
 * Schedule crons
 * @param {Object} bot telegram node api
 */
const cron = bot => {
    every('1m').do(() => c.sensorsData(bot));
    every('1m').do(() => c.yahooData());

    every('1m').do(() => c.statsTemp());
    every('1m').do(() => c.statsUsage());

    every('1m').do(() => c.wifiDevices(bot));
    every('1m').do(() => c.wanTraffic());

    every('1m').do(() => c.dnsQueries());
    every('1m').do(() => c.dnsTop());

    every('1m').do(() => c.lastfm());

    every('1h').do(() => c.adblockErrors());

    every('5h').do(() => c.raspUpdate(bot));
};

module.exports = cron;
