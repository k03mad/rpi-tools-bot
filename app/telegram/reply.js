'use strict';

const {array, string, print} = require('@k03mad/utils');
const {telegram} = require('../../env');

/**
 * Reply on command text
 * @param {object} bot telegram node api
 * @param {string} enteredText received command
 * @param {Function} cmd prepare answer with function
 * @param {string} args custom args
 */
module.exports = (bot, enteredText, cmd, args) => {
    const MAX_MSG_LENGTH = 4096;
    const textRe = new RegExp(`^/${enteredText}(@[a-z_]+)? ?(.+)?`);

    bot.onText(textRe, async ({chat: {id}}, match) => {
        if (id === telegram.chat) {
            bot.sendChatAction(id, 'typing').catch(err => print.ex(err));
            let response;

            try {
                let runArgs = '';

                if (args) {
                    runArgs = args;
                }

                if (match[2]) {
                    runArgs += ` ${match[2]}`;
                }

                response = await cmd(runArgs.trim());
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
                        print.ex(err, {
                            before: 'sendMessageErr',
                            exit: true,
                        });
                    }
                }
            }
        }
    });
};
