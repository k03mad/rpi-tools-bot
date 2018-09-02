const {run} = require('../../../../utils');

/**
 * Install updates
 */
const upgrade = async () => {
    const msg = [];

    const commands = [
        'sudo apt-fast update',
        'sudo apt-fast upgrade -y',
        'sudo apt-fast autoremove -y',
        'sudo apt-fast autoclean',
    ];

    for (const cmd of commands) {
        msg.push(`[${cmd}]\n\n${await run(cmd)}`);
    }

    return msg.join('\n\n');
};

module.exports = upgrade;
