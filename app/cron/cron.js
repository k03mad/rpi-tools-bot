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
    every('1m').do(() => sendSensorsData());
    every('5m').do(() => sendConnectedWiFiDevices(bot));

    every('10m').do(() => sendDnsQueries());
    every('10m').do(() => sendDnsTop());

    every('15m').do(() => sendLastFm());

    every('5h').do(() => checkRaspberryUpdates(bot));
};

module.exports = cron;
