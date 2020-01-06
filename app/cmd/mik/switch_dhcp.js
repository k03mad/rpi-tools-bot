'use strict';

const {mikrotik} = require('utils-mad');

module.exports = () => mikrotik.switch('/ip/dhcp-server', 'defconf');
