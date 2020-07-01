'use strict';

module.exports = {
    chat: Number(process.env.MY_CHAT),
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
    mikrotik: {
        host: process.env.MIKROTIK_HOST,
    },
    pi: {
        host: process.env.PI_HOST,
    },
};
