'use strict';

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
