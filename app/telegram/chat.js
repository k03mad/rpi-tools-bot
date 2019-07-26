'use strict';

const {array, string, print} = require('utils-mad');
const {chat} = require('../../env');

/**
 * Reply on command text
 * @param {object} bot telegram node api
 * @param {string} enteredText received command
 * @param {Function} cmd prepare answer with function
 */
const reply = (bot, enteredText, cmd) => {

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
                for (const msgPart of string.split(send, MAX_MSG_LENGTH)) {
                    try {
                        await bot.sendMessage(id, msgPart);
                    } catch (err) {
                        print.ex(err);
                    }
                }
            }
        }
    });
};

module.exports = {reply};
