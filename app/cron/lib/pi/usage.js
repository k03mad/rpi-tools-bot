const {run} = require('../../../utils');

/**
 * Send pi usage
 */
const sendUsage = async () => {
    const [uptime, temp, disk, ram] = await Promise.all([
        run('uptime'),
        run('cat /sys/class/thermal/thermal_zone0/temp'),
        run('df'),
        run('free -m'),
    ]);

    const cpuUsage = uptime.match(/average: (.+)/)[1].split(', ').map(elem => Number(elem.replace(',', '.')));
    const cpuTemp = Number(temp) / 1000;
    const [, diskUsed] = disk.match(/\/dev\/root +\d+ +([\d]+)/);
    const [, ramUsed] = ram.match(/Mem: +\d+ +(\d+)/);

    // sendToInflux('pi=usage', {
    //     cpu1: cpuUsage[0], cpu5: cpuUsage[1], cpu15: cpuUsage[2],
    //     cpuTemp,
    //     diskUsed,
    //     ramUsed,
    // });
    console.log(JSON.stringify({
        cpu1: cpuUsage[0], cpu5: cpuUsage[1], cpu15: cpuUsage[2],
        cpuTemp,
        diskUsed,
        ramUsed,
    }));
};

module.exports = sendUsage;
