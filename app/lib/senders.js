const track = require('../lib/analytics');
const {convertToArray, splitString} = require('./utils');
const {msg} = require('./messages');

const MAX_MSG_LENGTH = 4096;

/**
 * Send photo with text
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
 * Get search request with support for /ex and /ex@bot_name commands
 * (slice command length + 1 space from mes)
 */
const search = mes => {
    return mes.text.slice(mes.entities[0].length + 1);
};

/**
 * Commands regexp
 *
 * /^\/comm($|@[a-z_]+$)/      responds to /comm and /comm@bot_name without extra characters
 * /^\/comm(@[a-z_]+ .+| .+)/  responds to /comm <search> and /comm@bot_name <search>
 */
const q = (command, req) => {
    return req === 'search'
        ? new RegExp(`^/${command}(@[a-z_]+ .+| .+)`)
        : new RegExp(`^/${command}($|@[a-z_]+$)`);
};

module.exports = {
    answer,
    q,
    search
};
