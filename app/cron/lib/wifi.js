const {answer} = require('../../bot/lib/chat');
const {knownDevices, myChat} = require('../../env');
const {MAC_RE, sendToInflux} = require('../../utils');
const {msg} = require('../../messages');
const getDevices = require('../../bot/lib/commands/wifi/devices');

/**
 * Send connected devices and warn about unknown
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

            const data = [];
            const unknown = [];

            places[place].forEach((elem, index) => {
                if (!known.includes(elem.match(MAC_RE)[0])) {
                    unknown.push(elem);
                }

                for (const mac in knownDevices) {
                    // if device is not offline and from known list
                    if (!elem.split('\n').includes('-') && knownDevices[mac] === elem.match(MAC_RE)[0]) {
                        data.push(`${mac}=${index + 1}i`);
                    }
                }
            });

            // send unknown device warning
            if (unknown.length > 0) {
                answer(bot, {chat: {id: myChat}}, msg.cron.unknownDev(place, unknown.join('\n\n')));
            }

            // send online devices
            if (data.length > 0) {
                const tag = `wifi=devices${place}`;
                sendToInflux(tag, data.join()).catch(err => console.log(msg.common.influx(tag, err)));
            }

        }
    }
};

module.exports = sendConnectedWiFiDevices;
