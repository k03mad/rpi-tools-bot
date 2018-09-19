const {run} = require('../../../../utils');

/**
 * Update dns filter
 */
const update = () => run([
    'cd ../adblock-hosts-list && npm run deploy',
    'pihole -g',
], true);

module.exports = update;
