const {currentDate} = require('./utils');

const commands = [
    '/help - this list',
    '/graph - get all graphs',
    '/log - forever log',
    '',
    '/apt_update - check for updates',
    '/apt_upgrade - install updates',
    '',
    '/pi_sensors - get current sensors data',
    '/pi_reboot - reboot pi',
    '/pi_shutdown - shutdown pi',
    '/pi_stat - some usage stats',
    '',
    '/wifi_devices - wifi connected devices list',
    '/wifi_reboot - wifi spot reboot',
    '/wifi_spots - scan wifi spots',
];

const msg = {
    /* eslint-disable key-spacing, no-multi-spaces, indent */
    chart: {
        cor:        ex              => `${currentDate()} sending data to corlysis: ${ex}`,
        picErr:     ex              => `I can't get chart picture from corlysis\n${ex}`,
    },
    common: {
        choose:     ()              => 'Choose network',
        emptyLog:                      'Log is empty',
        level:      type            => `Something wrong with get level type: ${type}`,
        noDev:                         'No devices available',
        errDev:     (place, ex)     => `${currentDate()} get ${place} devices: ${ex}`,
        polling:    ex              => `${currentDate()} polling: ${ex}`,
        reboot:                        'Proceed to reboot',
        vendor:     (mac, ex)       => `${currentDate()} get ${mac} vendor: ${ex}`,
        updates:                       'No updates available',
    },
    cron: {
        updErr:     ex              => `${currentDate()} get pi updates: ${ex}`,
        unknownDev: (place, dev)    => `Unknown device connected to the ${place} router:\n\n${dev}`,
    },
    readme: {
        badges: [
                                       '![Dependencies](https://david-dm.org/k03mad/raspi-tlgrm-bot.svg)',
        ],
        footer:                        '(⌐■_■)',
        header:                        'Get data from Raspberry Pi 3',
        md:                            'README.md generated',
        txt:                           'commands.txt generated',
    },
    sensor: {
        err:        type            => `no ${type} data or too low level`,
        noData:                        `${currentDate()} data from sensors is empty`,
        bme:        ex              => `${currentDate()} cannot get data from bme: ${ex}`,
        mhz:        ex              => `${currentDate()} cannot get data from mhz: ${ex}`,
    },
    send: {
        norm:       ex              => `${currentDate()} sending normal message: ${ex}`,
        photo:      ex              => `${currentDate()} sending photo message: ${ex}`,
        typing:     ex              => `${currentDate()} sending typing message: ${ex}`,
    },
};

module.exports = {commands, msg};
