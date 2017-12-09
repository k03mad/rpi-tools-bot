const {run} = require('../lib/utils');
const {msg} = require('../lib/messages');

/**
 * Send command to terminal
 */
const runCmd = async command => {
    const output = await run(command);
    return output.stdout || output || msg.common.run;
};

module.exports = runCmd;
