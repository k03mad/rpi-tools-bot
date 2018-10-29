const {format} = require('date-fns');

const DATE_FORMAT = 'DD.MM.YYYY HH:mm:ss';

/**
 * Print message with datestamp
 * @param {string} msg to add time
 * @returns {string}
 */
const printMsg = msg => `\n[${format(new Date(), DATE_FORMAT)}]\n${msg}`;

module.exports = {printMsg};
