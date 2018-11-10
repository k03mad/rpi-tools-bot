const {date} = require('utils-mad');

/**
 * Print message with datestamp
 * @param {string} msg to add time
 * @returns {string}
 */
const printMsg = msg => `\n[${date.now()}]\n${msg}`;

module.exports = {printMsg};
