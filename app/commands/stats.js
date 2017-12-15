const {run} = require('../lib/utils');

/**
 * Get RPi3 GPU temperature
 *
 * bash log:
 * temp=50.5'C
 */
const gpuTemp = async () => {
    const gpu = await run('vcgencmd measure_temp');
    return `GPU temp: *${
        gpu.replace('temp=', '').replace('\'', '°')
    }*`;
};

/**
 * Get RPi3 CPU temperature
 *
 * bash log:
 * temp=50.5'C
 */
const cpuTemp = async () => {
    const cpu = await run('cat /sys/class/thermal/thermal_zone0/temp');
    return `CPU temp: *${
        (Number(cpu) / 1000).toFixed(1)
    }°C*`;
};

/**
 * Get RPi3 CPU usage
 *
 * bash log:
 * cpu  22118 0 3669 658313 3087 0 119 0 0 0
 */
const cpuUsage = async () => {
    let cpu = await run('grep \'cpu \' /proc/stat');
    cpu = cpu.split(' ').map(elem => Number(elem));
    cpu = (cpu[2] + cpu[4]) * 100 / (cpu[2] + cpu[4] + cpu[5]);
    return `CPU usage: *${
        cpu.toFixed(2)
    }%*\n`;
};

/**
 * Get RPi3 RAM usage
 *
 * bash log:
 *                 total        used        free      shared  buff/cache   available
 * Mem:            923          79         484          11         359         778
 */
const ramUsage = async () => {
    const ram = await run('free -m');
    const [, ramTotal] = ram.match(/Mem: +(\d+)/);
    const [, ramUsed] = ram.match(/Mem: +\d+ +(\d+)/);
    return `RAM usage: ${ramUsed} / *${ramTotal}MB*`;
};

/**
 * Get RPi3 disk usage
 *
 * bash log:
 * Файловая система Размер Использовано  Дост Использовано% Cмонтировано в
 * /dev/root           57G         5,4G   49G           10% /
 */
const diskUsage = async () => {
    const disk = await run('df -h');
    const [, diskTotal] = disk.match(/\/dev\/root +(\d+.)/);
    const [, diskUsed] = disk.match(/\/dev\/root +\d+. +([\d,]+)/);
    return `SD usage: ${diskUsed} / *${diskTotal}B*\n`;
};

/**
 * Get RPi3 uptime
 *
 * bash log:
 * 23:29:04 up 14 min,  3 users,  load average: 0,25, 0,26, 0,20
 */
const uptime = async () => {
    const overall = await run('uptime');
    const [, time] = overall.match(/up (.+), {2}\d/);
    return `Uptime: *${time}*`;
};

/**
 * Get some stats
 */
const getStats = async () => {
    const stats = await Promise.all([
        gpuTemp(),
        cpuTemp(),
        cpuUsage(),
        ramUsage(),
        diskUsage(),
        uptime()
    ]);

    return stats.join('\n');
};

module.exports = getStats;
