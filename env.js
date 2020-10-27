'use strict';

// https://github.com/yagop/node-telegram-bot-api/issues/319
process.env.NTBA_FIX_319 = true;

module.exports = {
    telegram: {
        chat: Number(process.env.TELEGRAM_MY_CHAT),
        token: process.env.TELEGRAM_RASPI_TOKEN,
        port: process.env.TELEGRAM_RASPI_PORT,
    },
    mikrotik: {
        cloud: process.env.MIKROTIK_CLOUD,
    },
    pi: {
        cert: process.env.PI_CERT_FOLDER,
    },
};
