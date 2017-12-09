const exec = require('executive');

/**
 * Run command at bash
 */
const run = async command => {
    const cmd = await exec(command);
    return cmd.stdout;
};

/**
 * Get some stats
 */
const getStats = async () => {
    const stats = [];

    // temp=50.5'C
    const gpuTemp = await run('vcgencmd measure_temp');
    stats.push(`GPU temp: ${gpuTemp.replace('temp=', '').replace('\'', '°')}`);

    // 51002
    const cpuTemp = await run('cat /sys/class/thermal/thermal_zone0/temp');
    stats.push(`CPU temp: ${(Number(cpuTemp) / 1000).toFixed(1)}°C\n\n`);

    // cpu  22118 0 3669 658313 3087 0 119 0 0 0
    let cpuUsage = await run('grep \'cpu \' /proc/stat');
    cpuUsage = cpuUsage.split(' ').map(elem => Number(elem));
    cpuUsage = (cpuUsage[2] + cpuUsage[4]) * 100 / (cpuUsage[2] + cpuUsage[4] + cpuUsage[5]);
    stats.push(`CPU usage: ${cpuUsage.toFixed(2)}%\n`);

    //                 total        used        free      shared  buff/cache   available
    // Mem:            923          79         484          11         359         778
    const ramUsage = await run('free -m');
    const [, ramTotal] = ramUsage.match(/Mem: +(\d+)/);
    const [, ramUsed] = ramUsage.match(/Mem: +\d+ +(\d+)/);
    stats.push(`RAM usage: ${ramUsed}MB/${ramTotal}MB`);

    // Файловая система Размер Использовано  Дост Использовано% Cмонтировано в
    // /dev/root           57G         5,4G   49G           10% /
    const diskUsage = await run('df -h');
    const [, diskTotal] = diskUsage.match(/\/dev\/root +(\d+)G/);
    const [, diskUsed] = diskUsage.match(/\/dev\/root +(\d+). +([\d,]+.)/);
    stats.push(`Disk usage: ${diskUsed}B/${diskTotal}B`);

    return stats.join('');
};

module.exports = getStats;
