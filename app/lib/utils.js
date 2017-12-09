const exec = require('executive');

/**
 * Send string to bash
 */
const run = async str => {
    const bash = await exec(str);
    return bash.stdout;
};

/**
 * Convert anything to array
 */
const convertToArray = elem => {
    return Array.isArray(elem) ? elem : [elem];
};

module.exports = {convertToArray, run};
