const {answer} = require('../../../bot/lib/chat');
const {knownDevices, my} = require('../../../env');
const {sendToInflux, checkTimer, MAC_RE} = require('../../../utils');
const {msg} = require('../../../messages');
const getDevices = require('../../../bot/lib/commands/wifi/devices');
const moment = require('moment');

let unknownDeviceTimer = moment();

/**
 * Send connected devices and warn about unknown
 * @param {Object} bot telegram node api
 */
const sendConnectedWiFiDevices = async bot => {
    const places = {};

    await Promise.all(['mad', 'knpl'].map(async place => {
        const devices = await getDevices(place);

        if (devices !== msg.common.noDev) {
            devices.includes('\n')
                ? places[place] = devices.split('\n\n')
                : console.log(msg.common.errDev(place, devices));
        }
    }));

    if (Object.keys(places).length > 0) {
        for (const place in places) {

            const known = Object.values(knownDevices).join();

            const data = {};
            const unknown = [];

            places[place].forEach((elem, index) => {
                if (!known.includes(elem.match(MAC_RE)[0])) {
                    unknown.push(elem);
                }

                for (const mac in knownDevices) {
                    // if device is not offline and from known list
                    if (!elem.split('\n').includes('-') && knownDevices[mac] === elem.match(MAC_RE)[0]) {
                        data[mac] = index + 1;
                    }
                }
            });

            // send unknown device warning every N minutes
            if (unknown.length > 0 && checkTimer(unknownDeviceTimer)) {
                answer(bot, {chat: {id: my.chat}}, msg.cron.unknownDev(place, unknown.join('\n\n')));
                unknownDeviceTimer = moment();
            }

            // send online devices
            if (Object.keys(data).length > 0) {
                sendToInflux(`router=devices${place}`, data);
            }

        }
    }
};

module.exports = sendConnectedWiFiDevices;
