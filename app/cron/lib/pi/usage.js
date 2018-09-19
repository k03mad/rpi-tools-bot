const {msg} = require('../../../messages');
const {run} = require('../../../utils');
const {sendToInflux} = require('../../../utils');

/**
 * Get RAM usage
 */
const ramUsage = async () => {
    const ram = await run('free -m', true);
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
    let cpu = await run('grep \'cpu \' /proc/stat', true);
    cpu = cpu.split(' ').map(elem => Number(elem));
    return (cpu[2] + cpu[4]) * 100 / (cpu[2] + cpu[4] + cpu[5]);
};

/**
 * Get CPU temperature
 */
const cpuTemp = async () => {
    const cpu = await run('cat /sys/class/thermal/thermal_zone0/temp', true);
    return (Number(cpu) / 1000).toFixed(1);
};

/**
 * Get GPU temperature
 */
const gpuTemp = async () => {
    const gpu = await run('vcgencmd measure_temp', true);
    return gpu.replace(/temp=|'C\n/g, '');
};

/**
 * Send disk and ram usage
 */
const sendUsage = async () => {
    let usage;

    try {
        usage = await Promise.all([diskUsage(), ramUsage(), cpuUsage(), cpuTemp(), gpuTemp()]);
    } catch (err) {
        console.log(msg.cron.usage(err));
        return;
    }

    sendToInflux('pi=usage', {disk: usage[0], ram: usage[1], cpuUs: usage[2], cpuTm: usage[3], gpu: usage[4]});
};

module.exports = sendUsage;
