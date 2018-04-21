const {every} = require('schedule');
const {sendSensorsData, sendNetworkSpeed, sendConnectedWiFiDevices, sendWiFiSpotsList, checkRaspberryUpdates} = require('./lib/crons');

/**
 * Bot crons
 */
const cron = bot => {
    every('2m').do(() => sendSensorsData(bot));
    every('5m').do(() => sendConnectedWiFiDevices(bot));

    every('11m').do(() => sendWiFiSpotsList());
    every('13m').do(() => sendNetworkSpeed());

    every('5h').do(() => checkRaspberryUpdates(bot));
};

module.exports = cron;
