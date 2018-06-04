const {every} = require('schedule');
const c = require('require-all')(`${__dirname}/lib`);

/**
 * Bot crons
 */
const cron = bot => {
    every('1m').do(() => c['send-sensors-data'](bot));
    every('5m').do(() => c['send-connected-wifi-devices'](bot));

    every('10m').do(() => c['send-dns-queries']());
    every('10m').do(() => c['send-dns-top']());

    every('15m').do(() => c['send-lastfm']());

    every('1h').do(() => c['send-adblock-errors']());

    every('5h').do(() => c['check-raspberry-updates'](bot));
};

module.exports = cron;
