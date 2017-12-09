const exec = require('executive');

/**
 * Get RPi3 GPU temperature
 *
 * bash log:
 * temp=50.5'C
 */
const gpuTemp = async () => {
    const gpu = await exec('vcgencmd measure_temp');
    return `GPU temp: ${
        gpu.stdout
            .replace('temp=', '')
            .replace('\'', '°')
    }`;
};

/**
 * Get RPi3 CPU temperature
 *
 * bash log:
 * temp=50.5'C
 */
const cpuTemp = async () => {
    const cpu = await exec('cat /sys/class/thermal/thermal_zone0/temp');
    return `CPU temp: ${
        (Number(cpu.stdout) / 1000).toFixed(1)
    }°C\n\n`;
};

/**
 * Get RPi3 CPU usage
 *
 * bash log:
 * cpu  22118 0 3669 658313 3087 0 119 0 0 0
 */
const cpuUsage = async () => {
    let cpu = await exec('grep \'cpu \' /proc/stat');
    cpu = cpu.split(' ').map(elem => Number(elem));
    cpu = (cpu[2] + cpu[4]) * 100 / (cpu[2] + cpu[4] + cpu[5]);
    return `CPU usage: ${
        cpu.toFixed(2)
    }%\n`;
};

/**
 * Get RPi3 RAM usage
 *
 * bash log:
 *                 total        used        free      shared  buff/cache   available
 * Mem:            923          79         484          11         359         778
 */
const ramUsage = async () => {
    const ram = await exec('free -m');
    const [, ramTotal] = ram.match(/Mem: +(\d+)/);
    const [, ramUsed] = ram.match(/Mem: +\d+ +(\d+)/);
    return `RAM usage: ${ramUsed}MB/${ramTotal}MB\n`;
};

/**
 * Get RPi3 disk usage
 *
 * bash log:
 * Файловая система Размер Использовано  Дост Использовано% Cмонтировано в
 * /dev/root           57G         5,4G   49G           10% /
 */
const diskUsage = async () => {
    const disk = await exec('df -h');
    const [, diskTotal] = disk.match(/\/dev\/root +(\d+G)/);
    const [, diskUsed] = disk.match(/\/dev\/root +\d+. +([\d,]+.)/);
    return `Disk usage: ${diskUsed}B/${diskTotal}B`;
};

/**
 * Get some stats
 */
const getStats = async () => {
    return [
        await gpuTemp(),
        await cpuTemp(),
        await cpuUsage(),
        await ramUsage(),
        await diskUsage()
    ].join(' ');
};

module.exports = getStats;
