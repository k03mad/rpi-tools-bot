'use strict';

const {array, string} = require('utils-mad');
const {chat} = require('../../env');
const {date} = require('utils-mad');

const MAX_MSG_LENGTH = 4096;

/**
 * Print message with datestamp
 * @param {string} msg to add time
 * @returns {string}
 */
const printMsg = msg => {
    const dateMsg = `\n[${date.now()}]\n`;

    const prettyMsg = typeof msg === 'object'
        ? JSON.stringify(msg, null, 4)
        : msg;

    console.log(dateMsg + prettyMsg);
    return prettyMsg;
};

/**
 * Open repo and run script
 * @param {string} repo to change dir
 * @param {string} script to run
 * @returns {string}
 */
const runRepoScript = (repo, script) => [
    `cd ~/git/${repo}`,
    'git reset --hard',
    'git pull',
    'npm run setup',
    `npm run ${script}`,
];

/**
 * Send message to telegram user
 * @param {Object} bot telegram node api
 * @param {Object} mes telegram api message object
 * @param {string|string[]} sends something to send
 * @param {Object} opts telegram api options
 */
const answer = async (bot, mes, sends, opts = {}) => {
    const sendOpts = opts.markdown ? {parse_mode: 'Markdown', disable_web_page_preview: true} : {};

    for (const send of array.convert(sends)) {
        if (send.length > MAX_MSG_LENGTH) {
            // split by new lines
            const longStringArr = string.split(send, MAX_MSG_LENGTH);

            for (const elemPart of longStringArr) {
                try {
                    await bot.sendMessage(mes.chat.id, elemPart, sendOpts);
                } catch (err) {
                    console.log(printMsg(err));
                }
            }

        } else {
            bot.sendMessage(mes.chat.id, send, sendOpts).catch(err => printMsg(err));
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
    const textRe = new RegExp(`^/${enteredText}(@[a-z_]+)? ?(.+)?`);

    bot.onText(textRe, async (mes, match) => {
        if (chat === mes.chat.id) {
            bot.sendChatAction(mes.chat.id, 'typing').catch(err => printMsg(err));
            answer(bot, mes, await cmd(match[2]), opts);
        }
    });
};

module.exports = {
    printMsg,
    runRepoScript,
    reply,
};
