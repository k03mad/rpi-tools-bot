const {run} = require('../../../utils');

/**
 * Update dns filter
 */
module.exports = () => run([
    'cd ../adblock-hosts-list && git reset --hard && npm run deploy',
    'pihole -g',
], true);
