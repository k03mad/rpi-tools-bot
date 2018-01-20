const scanner = require('node-wifiscanner2');

/**
 * Scan wifi
 */
const scan = () => {
    return new Promise((resolve, reject) => {
        scanner.scan((err, networks) => {
            err ? reject(err) : resolve(networks);
        });
    });
};

scan().then(console.log);

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
                    devices.push(`${key}: ${elem[key]}`);
                }
            }

            devices.push('');
        });

    return devices.join('\n');
};

module.exports = arp;
