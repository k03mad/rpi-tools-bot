const {run} = require('../../../../utils');

/**
 * Update dns filter
 */
const update = async () => {
    const msg = [];

    const commands = [
        'cd ../adblock-hosts-list && npm run deploy',
        'pihole -g',
    ];

    for (const cmd of commands) {
        msg.push(`[${cmd}]\n\n${await run(cmd)}`);
    }

    return msg.join('\n\n');
};

module.exports = update;
