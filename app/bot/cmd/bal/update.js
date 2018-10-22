const {run} = require('../../../utils');

/**
 * Update balance data
 */
module.exports = () => run([
    'cd ../get-balance-providers',
    'git reset --hard',
    'git pull',
    'npm run setup',
    'npm run start',
].join(' && '));
