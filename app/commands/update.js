const {run} = require('../lib/utils');

/**
 * Check for updates
 */
const update = async () => {
    const cmd = [];
    cmd.push(
        await run('sudo apt-get update'),
        await run('sudo apt-get upgrade')
    );

    return cmd.join('\n');
};

module.exports = update;
