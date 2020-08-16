'use strict';

module.exports = {
    chat: Number(process.env.MY_CHAT),
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
    music: {
        playlist: process.env.YANDEX_MUSIC_PLAYLIST,
    },
    spotify: {
        id: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_CLIENT_SECRET,
    },
};
