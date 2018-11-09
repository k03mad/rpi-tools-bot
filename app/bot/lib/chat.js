const {chat} = require('../../env');
const {convertToArray} = require('../../utils');
const msg = require('../../errors');

const MAX_MSG_LENGTH = 4096;

/**
 * Split long string by \n into array of strings
 * @param {string} str to split
 * @param {number} l max string length
 * @returns {string[]}
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
 * Send message to telegram user
 * @param {Object} bot telegram node api
 * @param {Object} mes telegram api message object
 * @param {string|string[]} sends something to send
 * @param {Object} opts telegram api options
 */
const answer = async (bot, mes, sends, opts = {}) => {
    const sendOpts = opts.markdown ? {parse_mode: 'Markdown', disable_web_page_preview: true} : {};

    for (const send of convertToArray(sends)) {
        if (send.length > MAX_MSG_LENGTH) {
            // split by new lines
            const longStringArr = splitString(send, MAX_MSG_LENGTH);

            for (const elemPart of longStringArr) {
                try {
                    await bot.sendMessage(mes.chat.id, elemPart, sendOpts);
                } catch (err) {
                    console.log(msg.send.norm(mes, err));
                }
            }

        } else {
            bot.sendMessage(mes.chat.id, send, sendOpts).catch(err => console.log(msg.send.norm(err)));
        }
    }
};

/**
 * Reply on command text
 * @param {Object} bot telegram node api
 * @param {string} enteredText received command
 * @param {Function} cmd prepare answer with function
 * @param {Object} opts telegram api options
 */
const reply = (bot, enteredText, cmd, opts = {}) => {
    bot.onText(new RegExp(`^/${enteredText}($|@[a-z_]+$)`), async mes => {
        if (chat === mes.chat.id) {
            bot.sendChatAction(mes.chat.id, 'typing').catch(err => console.log(msg.send.typing(err)));
            answer(bot, mes, await cmd(), opts);
        }
    });
};

module.exports = {answer, reply};
