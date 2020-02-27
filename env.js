'use strict';

module.exports = {
    proxy: {
        socksHost: process.env.PROXY_HOST,
        socksPort: process.env.PROXY_PORT,
        socksUsername: process.env.PROXY_USER,
        socksPassword: process.env.PROXY_PASS,
    },
    chat: Number(process.env.MY_CHAT),
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
};
