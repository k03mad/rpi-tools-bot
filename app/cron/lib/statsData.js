const {run} = require('../../utils');

/**
 * Get GPU temperature
 *
 * bash log:
 * temp=50.5'C
 */
const gpuTemp = async () => {
    const gpu = await run('vcgencmd measure_temp');
    return gpu.replace('temp=', '');
};

/**
 * Get CPU temperature
 *
 * bash log:
 * temp=50.5'C
 */
const cpuTemp = async () => {
    const cpu = await run('cat /sys/class/thermal/thermal_zone0/temp');
    return (Number(cpu) / 1000).toFixed(1);
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
    return cpu.toFixed(2);
};

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
 * Some versions
 */
const ver = async () => {
    const versions = await Promise.all([
        run('cat /etc/*release | head -n 1'),
        run('uname -rs'),
        run('node -v'),
        run('npm -v'),
    ]);

    const msg = [
        versions[0].replace(/PRETTY_NAME=|"/g, '') + versions[1],
        `node: ${versions[2].replace(/^v/, '')}`,
        `npm: ${versions[3].replace('\n', '')}`,
    ];

    return msg.join('\n');
};

/**
 * Get all stats
 */
const getStats = async () => {
    const stats = await Promise.all([

        ver(),

        gpuTemp(), cpuTemp(),
        cpuUsage(), ramUsage(),
        diskUsage(),
    ]);

    return stats.join('\n-----\n');
};

getStats().then(console.log);

module.exports = getStats;
