const {botanToken} = require('./env');
const botan = require('botanio')(botanToken);

/**
 * Track current command
 */
const track = msg => {
    let {text} = msg;

    if (text.includes(' ')) {
        text = text.substr(0, text.indexOf(' '));
    }

    if (text.includes('@')) {
        text = text.substr(0, text.indexOf('@'));
    }

    return new Promise(resolve => {
        botan.track(msg, text, (err, res) => {
            err ? resolve(err) : resolve(res);
        });
    });
};

module.exports = track;
