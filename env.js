'use strict';

module.exports = {
    telegram: {
        chat: Number(process.env.TELEGRAM_MY_CHAT),
        token: process.env.TELEGRAM_RASPI_TOKEN,
    },
    next: {
        config: process.env.NEXT_DNS_CONFIG,
    },
};
