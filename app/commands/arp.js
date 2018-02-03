const netList = require('../../node_modules/network-list/src/index.js');

/**
 * Scan local network
 */
const scan = () => {
    return new Promise((resolve, reject) => {
        netList.scan({}, (err, obj) => {
            err ? reject(err) : resolve(obj);
        });
    });
};

/**
 * Get local device list
 */
const arp = async () => {
    const devices = [];
    const scanned = await scan();

    scanned
        .filter(elem => elem.alive)
        .forEach(elem => {
            for (const key in elem) {
                if (key !== 'alive' && elem[key] && !elem[key].includes('Error')) {
                    devices.push(elem[key]);
                }
            }

            devices.push('');
        });

    return devices.join('\n');
};

module.exports = arp;
