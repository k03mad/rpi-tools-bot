'use strict';

const {mikrotik} = require('utils-mad');

module.exports = async () => {
    const [nat] = await mikrotik.get(['/ip/firewall/nat/print']);
    const pihole = nat.filter(elem => elem['log-prefix'] === 'pihole');
    const ids = pihole.map(elem => elem['.id']);

    const status = pihole[0].disabled === 'false' ? 'disable' : 'enable';
    await mikrotik.get([...ids.map(id => [`/ip/firewall/nat/${status}`, `=.id=${id}`])]);

    return `${status}d`;
};
