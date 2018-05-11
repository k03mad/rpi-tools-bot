const {getMacVendor, run} = require('../../lib/utils');
const {msg} = require('../../lib/messages');

/**
 * Get WiFi list
 *
 * bash log:
 * wlan0     Scan completed :
 *         Cell 01 - Address: 2A:28:5D:60:42:B6
 *                   Channel:2
 *                   Frequency:2.417 GHz (Channel 2)
 */
const wifiList = async () => {
    const list = await run('sudo iwlist wlan0 scanning');
    const separateWifi = list.split(/Address:/);

    const wifiArray = [];

    separateWifi.forEach((elem, i) => {
        if (i !== 0) {
            const [, mac] = elem.match(/^ (.+)\n/);
            const [, freq] = elem.match(/Frequency:(.+)/);
            const [, signal] = elem.match(/Signal level=(.+) dBm/);
            const [, enc] = elem.match(/Encryption key:(.+)\n/);
            const [, essid] = elem.match(/ESSID:"(.+)"/);

            wifiArray.push(enc === 'off'
                ? {enc, essid, freq, mac, signal}
                : {essid, freq, mac, signal}
            );
        }
    });

    return wifiArray;
};

/**
 * Convert signal dBm to percent
 */
const signalToPercent = async () => {
    const list = await wifiList();
    list.forEach(elem => {
        const signalNum = Number(elem.signal);

        if (signalNum <= -100) {
            elem.signal = 0;
        } else if (signalNum >= -50) {
            elem.signal = 100;
        } else {
            elem.signal = 2 * (signalNum + 100);
        }

        elem.signal += '%';
    });

    return list;
};

/**
 * Add mac-address vendor info
 */
const addVendor = async () => {
    const list = await signalToPercent();

    await Promise.all(list.map(async elem => {
        try {
            const vendor = await getMacVendor(elem.mac);

            if (vendor !== 'No vendor') {
                elem.vendor = vendor;
            }
        } catch (err) {
            console.log(msg.common.vendor(elem.mac, err));
        }
    }));

    return list;
};

/**
 * Sort WiFi list
 */
const sortList = async () => {
    const list = await addVendor();

    /**
     * Use signal strength to sort list
     */
    const compare = (a, b) => {
        const first = Number(a.signal.replace('%', ''));
        const second = Number(b.signal.replace('%', ''));

        let comparison = 0;

        if (first > second) {
            comparison = 1;
        } else if (first < second) {
            comparison = -1;
        }

        return comparison * -1;
    };

    return list.sort(compare);
};

/**
 * Convert list to message
 */
const generateList = async () => {
    const list = await sortList();

    const wifi = [];

    for (const elem of list) {
        wifi.push(
            `*${elem.essid}* (${elem.signal})`,
            elem.freq,
            elem.mac
        );

        if (elem.vendor) {
            wifi.push(elem.vendor);
        }

        if (elem.enc) {
            wifi.push(`_Encryption ${elem.enc}_`);
        }

        wifi.push('');
    }

    return wifi.join('\n');
};

module.exports = generateList;
