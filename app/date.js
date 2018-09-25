const {format} = require('date-fns');

const DATE_FORMAT = 'DD.MM.YYYY HH:mm:ss';

/**
 * Print message with datestamp
 */
const printMsg = msg => `\n[${format(new Date(), DATE_FORMAT)}]\n${msg}`;

module.exports = {printMsg};
