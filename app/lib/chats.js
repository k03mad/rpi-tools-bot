const {convertToArray, track} = require('./utils');
const {msg} = require('./messages');
const {myChat} = require('../../env');

const MAX_MSG_LENGTH = 4096;

/**
 * Split long string by \n into array of strings
 */
const splitString = (str, l) => {
    const strs = [];

    while (str.length > l) {
        let pos = str.substring(0, l).lastIndexOf('\n');
        pos = pos <= 0 ? l : pos;
        strs.push(str.substring(0, pos));

        let i = str.indexOf('\n', pos) + 1;

        if (i < pos || i > pos + l) {
            i = pos;
        }

        str = str.substring(i);
    }

    strs.push(str);
    return strs;
};

/**
 * Send message to user
 */
const answer = async (bot, mes, sends, opts) => {
    for (const send of convertToArray(sends)) {

        if (Buffer.isBuffer(send)) {
            bot.sendPhoto(mes.chat.id, send, opts).catch(ex => console.log(msg.send.photo(mes, ex)));

        } else if (send.length > MAX_MSG_LENGTH) {
            // split by new lines
            const longStringArr = splitString(send, MAX_MSG_LENGTH);

            for (const elemPart of longStringArr) {
                try {
                    await bot.sendMessage(mes.chat.id, elemPart, opts);
                } catch (ex) {
                    console.log(msg.send.norm(mes, ex));
                }
            }

        } else {
            bot.sendMessage(mes.chat.id, send, opts).catch(ex => console.log(msg.send.norm(mes, ex)));
        }

    }

    track(mes);
};

/**
 * Reply on command text
 */
const reply = (bot, enteredText, cmd, args = [], opts = {}) => {
    bot.onText(new RegExp(`^/${enteredText}($|@[a-z_]+$)`), async mes => {
        if ([myChat].includes(String(mes.chat.id))) {
            bot.sendChatAction(mes.chat.id, 'typing').catch(ex => console.log(msg.send.typing(mes, ex)));
            answer(bot, mes, await cmd(...convertToArray(args)), opts);
        }
    });
};

/**
 * Return keyboard options
 */
const keyboard = arr => {
    return {
        reply_markup: {
            keyboard: [arr],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
};

module.exports = {
    answer,
    reply,
    keyboard
};
