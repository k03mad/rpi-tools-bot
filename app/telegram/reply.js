'use strict';

const {array, string, print} = require('utils-mad');
const {chat} = require('../../env');

/**
 * Reply on command text
 * @param {object} bot telegram node api
 * @param {string} enteredText received command
 * @param {Function} cmd prepare answer with function
 */
module.exports = (bot, enteredText, cmd) => {
    const MAX_MSG_LENGTH = 4096;
    const textRe = new RegExp(`^/${enteredText}(@[a-z_]+)? ?(.+)?`);

    bot.onText(textRe, async ({chat: {id}}, match) => {
        if (id === chat) {
            bot.sendChatAction(id, 'typing').catch(err => print.ex(err));
            let response;

            try {
                response = await cmd(match[2]);
            } catch (err) {
                response = err.toString();
            }

            for (const send of array.convert(response)) {
                const isMsgString = typeof send === 'string';

                for (const msgPart of string.split(isMsgString ? send : send.message, MAX_MSG_LENGTH)) {
                    bot.sendChatAction(id, 'typing').catch(err => print.ex(err));

                    try {
                        await bot.sendMessage(
                            id,
                            isMsgString ? `\`\`\`\n${msgPart}\`\`\`` : msgPart,
                            isMsgString ? {parse_mode: 'Markdown'} : send.opts,
                        );
                    } catch (err) {
                        print.ex(err, {exit: true});
                    }
                }
            }
        }
    });
};
