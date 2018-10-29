const {run} = require('../../../utils');

module.exports = () => run([
    'cd ../get-balance-providers',
    'git reset --hard',
    'git pull',
    'npm run setup',
    'npm run start',
].join(' && '));
