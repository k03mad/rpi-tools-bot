const netList = require('network-list');

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

    let scanned = await scan();
    scanned = scanned.filter(elem => elem.alive);
    scanned.forEach(elem => {
        for (const key in elem) {
            if (key !== 'alive' && elem[key] && !elem[key].includes('Error')) {
                devices.push(`${key}: ${elem[key]}`);
            }
        }

        devices.push('');
    });

    return devices.join('\n');
};

module.exports = arp;
