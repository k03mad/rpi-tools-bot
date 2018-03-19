const track = require('../lib/analytics');
const {convertToArray, splitString} = require('./utils');
const {msg} = require('./messages');

const MAX_MSG_LENGTH = 4096;

/**
 * Send text mes
 */
const sendText = async (bot, mes, text) => {

    for (const elem of convertToArray(text)) {
        // max text length limit
        if (elem.length > MAX_MSG_LENGTH) {
            // split by lines
            const longStringArr = splitString(elem, MAX_MSG_LENGTH);

            for (const elemPart of longStringArr) {
                await bot.sendMessage(mes.chat.id, elemPart);
            }

        } else {
            bot.sendMessage(mes.chat.id, elem).catch(ex => console.log(msg.send.norm(mes, ex)));
        }
    }

    track(mes);
};

/**
 * Send text mes with markdown
 */
const sendMdText = (bot, mes, text, disablePreview) => {
    convertToArray(text).forEach(elem => {
        const opts = {parse_mode: 'Markdown'};

        if (disablePreview) {
            opts.disable_web_page_preview = true;
        }

        bot.sendMessage(mes.chat.id, elem, opts).catch(ex => console.log(msg.send.mark(mes, ex)));
    });

    track(mes);
};

/**
 * Send photo
 */
const sendPhoto = (bot, mes, photo) => {
    if (typeof photo === 'string') {
        sendText(bot, mes, photo);
    } else {
        bot.sendPhoto(mes.chat.id, photo).catch(ex => console.log(msg.send.photo(mes, ex)));
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
    q,
    search,
    sendMdText,
    sendPhoto,
    sendText
};
