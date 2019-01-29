'use strict';

// remove "Automatic enabling of cancellation of promises is deprecated"
process.env.NTBA_FIX_319 = true;

module.exports = {
    yandex: {
        login: process.env.YANDEX_LOGIN,
        password: process.env.YANDEX_PASS,
    },
    proxy: {
        socksHost: process.env.PROXY_HOST,
        socksPort: process.env.PROXY_PORT,
        socksUsername: process.env.PROXY_USER,
        socksPassword: process.env.PROXY_PASS,
    },
    router: {
        url: process.env.ROUTER_URL,
        login: process.env.ROUTER_LOGIN,
        password: process.env.ROUTER_PASSWORD,
    },
    chat: Number(process.env.MY_CHAT),
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
};
