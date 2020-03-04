'use strict';

const {mikrotik} = require('utils-mad');

module.exports = async () => {
    const nat = await mikrotik.write('/ip/firewall/nat/print');
    const pi = nat.filter(elem => !elem.comment || elem.comment.startsWith('pi'));
    const ids = pi.map(elem => elem['.id']);

    const status = pi[0].disabled === 'false' ? 'disable' : 'enable';
    await mikrotik.write([...ids.map(id => [`/ip/firewall/nat/${status}`, `=.id=${id}`])]);

    return `${status}d`;
};
