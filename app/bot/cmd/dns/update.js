const {run} = require('../../../utils');

/**
 * Update dns filter
 */
module.exports = () => run([
    [
        'cd ../adblock-hosts-list',
        'git reset --hard',
        'git pull',
        'npm run setup',
        'npm run deploy',
    ].join(' && '),

    'pihole -g',
], {titles: true});
