const REQUEST_TIMEOUTS = {
    connect: 7000,
    socket: 8000,
    request: 10000,
};

const MAC_RE = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;

module.exports = {
    MAC_RE,
    REQUEST_TIMEOUTS,
};
