'use strict';

const env = require('../../../env');
const {mikrotik, array} = require('utils-mad');

/** @returns {Promise<string>} */
module.exports = async () => {
    const servers = [

        env.mikrotik.host,
        env.pi.host,
        '1.1.1.1, 8.8.8.8, 9.9.9.9',

    ].map(elem => elem.includes(',')
        ? elem.replace(/\s+/g, '')
        : `${elem},`.repeat(3).slice(0, -1),
    );

    const dhcp = await mikrotik.write('/ip/dhcp-server/network/print');
    const nextServer = array.next(servers, dhcp[0]['dns-server']);

    await mikrotik.write(['/ip/dhcp-server/network/set', '=.id=*1', `=dns-server=${nextServer}`]);
    return `DNS: ${[...new Set(nextServer.split(','))].join(', ')}`;
};
