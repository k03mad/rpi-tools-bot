const {printMsg} = require('../date');
const {proxy, telegramToken} = require('../env');
const {reply} = require('./lib/chat');
const Agent = require('socks5-https-client/lib/Agent');
const b = require('require-all')(`${__dirname}/cmd`);
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(telegramToken, {
    polling: {
        interval: 3000,
        params: {allowed_updates: ['message']},
    },
    request: {
        agentClass: Agent,
        agentOptions: proxy,
    },
});

reply(bot, 'help', b.help);

reply(bot, 'app_log', b.app.log);

reply(bot, 'apt_update', b.apt.update);
reply(bot, 'apt_upgrade', b.apt.upgrade);

reply(bot, 'bal_update', b.bal.update);

reply(bot, 'dns_update', b.dns.update);

reply(bot, 'mus_unavail', b.mus.unavail);
reply(bot, 'mus_dups', b.mus.dups);

reply(bot, 'pi_reboot', b.pi.reboot);
reply(bot, 'pi_shutdown', b.pi.shutdown);

reply(bot, 'ufw_clean', b.ufw.clean);
reply(bot, 'ufw_log', b.ufw.log, {markdown: true});

bot.on('polling_error', error => console.log(printMsg(error)));

module.exports = bot;
