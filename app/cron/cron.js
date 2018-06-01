const {every} = require('schedule');
const checkRaspberryUpdates = require('./lib/updates');
const sendConnectedWiFiDevices = require('./lib/wifi');
const sendDnsQueries = require('./lib/dns-queries');
const sendDnsTop = require('./lib/dns-top');
const sendLastFm = require('./lib/lastfm');
const sendSensorsData = require('./lib/sensors');

/**
 * Bot crons
 */
const cron = bot => {
    // free corlysis plan = 300000 points/2weeks

    // 3 sensors * 20160 1min/2weeks = 60480 points/2weeks
    every('1m').do(() => sendSensorsData());
    // ~10 * 4032 = 40320
    every('5m').do(() => sendConnectedWiFiDevices(bot));

    // 2 * 2016 = 4032
    every('10m').do(() => sendDnsQueries());
    // 10 * 2016 = 20160
    every('10m').do(() => sendDnsTop());

    // 2 * 1344 = 2688
    every('15m').do(() => sendLastFm());

    every('5h').do(() => checkRaspberryUpdates(bot));
};

module.exports = cron;
