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
 * Get CPU usage
 *
 * bash log:
 * cpu  22118 0 3669 658313 3087 0 119 0 0 0
 */
const cpuUsage = async () => {
    let cpu = await run('grep \'cpu \' /proc/stat');
    cpu = cpu.split(' ').map(elem => Number(elem));
    cpu = (cpu[2] + cpu[4]) * 100 / (cpu[2] + cpu[4] + cpu[5]);
    return Math.round(cpu);
};

/**
 * Send disk and ram usage
 */
const sendUsage = async () => {
    let usage;

    try {
        usage = await Promise.all([diskUsage(), ramUsage(), cpuUsage()]);
    } catch (err) {
        console.log(msg.stats.usage(err));
        return;
    }

    const TAG = 'stat=usage';
    sendToInflux(TAG, `disk=${usage[0]},ram=${usage[1]}i,cpu=${usage[2]}`).catch(err => console.log(msg.common.influx(TAG, err)));
};

module.exports = sendUsage;
