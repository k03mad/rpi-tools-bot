const {run, sendToInflux} = require('../../../utils');

/**
 * Send pi usage
 */
const sendUsage = async () => {
    const [load, temp, disk, ram] = await Promise.all([
        run('cat /proc/loadavg'),
        run('cat /sys/class/thermal/thermal_zone0/temp'),
        run('df'),
        run('free -m'),
    ]);

    const cpuUsage = load.split(' ').map(x => Number(x));
    const cpuTemp = Number(temp) / 1000;
    const diskUsed = Number(disk.match(/\/dev\/root +\d+ +([\d]+)/)[1]);
    const ramUsed = Number(ram.match(/Mem: +\d+ +(\d+)/)[1]);

    sendToInflux({
        db: 'sys',
        tags: {pi: 'usage'},
        values: {
            cpu1: cpuUsage[0], cpu5: cpuUsage[1], cpu15: cpuUsage[2],
            cpuTemp, diskUsed, ramUsed,
        },
    });
};

module.exports = sendUsage;
