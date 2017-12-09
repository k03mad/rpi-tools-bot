const {run} = require('../lib/utils');
const {msg} = require('../lib/messages');

/**
 * Send command to RPi3 terminal
 */
const runCmd = async cmd => {
    const output = await run(cmd);

    if (typeof output === 'string') {
        return output;
    }

    return output.stdout || output.stderr || msg.common.run;
};

module.exports = runCmd;
