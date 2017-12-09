const exec = require('executive');

/**
 * Send command to bash
 */
const run = async str => {
    const bash = await exec(str);
    return bash.stdout || bash.stderr || bash;
};

/**
 * Convert anything to array
 */
const convertToArray = elem => {
    return Array.isArray(elem) ? elem : [elem];
};

module.exports = {convertToArray, run};
