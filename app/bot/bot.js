const {proxy, telegramToken} = require('../env');
const {reply} = require('./lib/chat');
const c = require('require-all')(`${__dirname}/cmd`);
const Agent = require('socks5-https-client/lib/Agent');
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

reply(bot, 'help', c.help, 'bot');

reply(bot, 'app_log', c.log);

reply(bot, 'apt_update', c.apt.update);
reply(bot, 'apt_upgrade', c.apt.upgrade);

reply(bot, 'dns_update', c.dns.update);

reply(bot, 'pi_reboot', c.pi.reboot);
reply(bot, 'pi_shutdown', c.pi.shutdown);

reply(bot, 'ufw_clean', c.ufw.clean);
reply(bot, 'ufw_log', c.ufw.log);

module.exports = bot;
