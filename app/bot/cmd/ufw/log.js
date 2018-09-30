const {run} = require('../../../utils');

/**
 * Get UFW logs
 */
module.exports = async () => {
    const log = await run('grep UFW /var/log/syslog');

    if (!log) {
        return 'Log is empty';
    }

    const counts = {};

    log
        .split('\n')
        .filter(Boolean)
        .map(elem => {
            const [, ip, port] = elem.match(/SRC=(.+?) .+DPT=(.+?) /);
            return `[${ip}](https://ipinfo.io/${ip}) to ${port}`;
        })
        .forEach(x => {
            counts[x] = (counts[x] || 0) + 1;
        });

    const output = [];

    for (const elem in counts) {
        output.push(`${elem} (${counts[elem]} tries)`);
    }

    return output.join('\n');
};
