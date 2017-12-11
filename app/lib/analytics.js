const {metricsToken} = require('./env');
const botmetrics = require('node-botmetrics')(metricsToken);

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

    botmetrics.track({
        message_type: 'incoming',
        metadata: msg,
        platform: 'telegram',
        text,
        user_id: msg.from.username || `${msg.from.first_name} ${msg.from.last_name}`
    });
};

module.exports = track;
