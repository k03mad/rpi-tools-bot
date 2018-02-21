const {run} = require('../lib/utils');

/**
 * Install updates
 */
const upgrades = async () => {
    const msg = [];
    // apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
    msg.push(await run('sudo apt-get update'));
    msg.push(await run('sudo apt-get upgrade'));
    msg.push(await run('sudo apt-get upgrade -y'));
    msg.push(await run('sudo apt-get autoremove'));
    msg.push(await run('sudo apt-get autoclean'));

    return msg.join('\n\n');
};

module.exports = upgrades;
