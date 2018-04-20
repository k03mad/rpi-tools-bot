const {every} = require('schedule');
const {sendSensorsData, sendConnectedWiFiDevices, sendWiFiSpotsList, checkRaspberryUpdates} = require('./lib/crons');

/**
 * Bot crons
 */
const cron = bot => {
    every('1m').do(() => sendSensorsData(bot));
    every('5m').do(() => sendConnectedWiFiDevices(bot));
    every('10m').do(() => sendWiFiSpotsList());
    every('5h').do(() => checkRaspberryUpdates(bot));
};

module.exports = cron;
