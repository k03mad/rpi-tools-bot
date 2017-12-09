const {commands} = require('../lib/messages');

/**
 * Get help message for GitHub README.md and bot help
 */
const getHelpMessage = output => {
    if (output === 'readme') {
        const help = commands.map(elem => {
            const command = elem.split(' - ');
            return elem ? `**${command[0]}** ${command[1]}` : '';
        });

        return help;
    }

    return commands.join('\n');
};

module.exports = getHelpMessage;
