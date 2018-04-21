const {every} = require('schedule');
const {sendSensorsData, sendNetworkSpeed, sendConnectedWiFiDevices, sendWiFiSpotsList, checkRaspberryUpdates} = require('./lib/crons');

/**
 * Bot crons
 */
const cron = bot => {
    every('1m').do(() => sendSensorsData(bot));
    every('5m').do(() => sendConnectedWiFiDevices(bot));

    every('10m').do(() => sendWiFiSpotsList());
    every('15m').do(() => sendNetworkSpeed());

    every('5h').do(() => checkRaspberryUpdates(bot));
};

module.exports = cron;
