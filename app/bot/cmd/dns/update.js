const {run} = require('../../../utils');

/**
 * Update dns filter
 */
const update = () => run([
    'cd ../adblock-hosts-list && git reset --hard && npm run deploy',
    'pihole -g',
], true);

module.exports = update;
