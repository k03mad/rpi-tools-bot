const {msg} = require('../../messages');
const {run} = require('../../utils');
const {sendToInflux} = require('../../utils');

/**
 * Get RAM usage
 *
 * bash log:
 *                 total        used        free      shared  buff/cache   available
 * Mem:            923          79         484          11         359         778
 */
const ramUsage = async () => {
    const ram = await run('free -m');
    const [, ramUsed] = ram.match(/Mem: +\d+ +(\d+)/);
    return ramUsed;
};

/**
 * Get disk usage
 *
 * bash log:
 * Файловая система Размер Использовано  Дост Использовано% Cмонтировано в
 * /dev/root           57G         5,4G   49G           10% /
 */
const diskUsage = async () => {
    const disk = await run('df -h');
    const [, diskUsed] = disk.match(/\/dev\/root +\d+. +([\d,]+)/);
    return diskUsed.replace(',', '.');
};

/**
 * Send disk and ram usage
 */
const sendUsage = async () => {
    let usage;

    try {
        usage = await Promise.all([diskUsage(), ramUsage()]);
    } catch (err) {
        console.log(msg.stats.usage(err));
        return;
    }

    const TAG = 'stat=usage';
    sendToInflux(TAG, `disk=${usage[0]}i,ram=${usage[1]}i`).catch(err => console.log(msg.common.influx(TAG, err)));
};

module.exports = sendUsage;
