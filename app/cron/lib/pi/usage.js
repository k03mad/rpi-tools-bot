const {msg} = require('../../../messages');
const {run} = require('../../../utils');
const {sendToInflux} = require('../../../utils');

/**
 * Get RAM usage
 */
const ramUsage = async () => {
    const ram = await run('free -m');
    const [, ramUsed] = ram.match(/Mem: +\d+ +(\d+)/);
    return ramUsed;
};

/**
 * Get disk usage
 */
const diskUsage = async () => {
    const disk = await run('df');
    const [, diskUsed] = disk.match(/\/dev\/root +\d+ +([\d]+)/);
    return diskUsed;
};

/**
 * Get CPU usage
 */
const cpuUsage = async () => {
    let cpu = await run('grep \'cpu \' /proc/stat');
    cpu = cpu.split(' ').map(elem => Number(elem));
    return (cpu[2] + cpu[4]) * 100 / (cpu[2] + cpu[4] + cpu[5]);
};

/**
 * Send disk and ram usage
 */
const sendUsage = async () => {
    let disk;
    let ram;
    let cpu;

    try {
        [disk, ram, cpu] = await Promise.all([diskUsage(), ramUsage(), cpuUsage()]);
    } catch (err) {
        console.log(msg.cron.usage(err));
        return;
    }

    sendToInflux('pi=usage', {disk, ram, cpu});
};

module.exports = sendUsage;
