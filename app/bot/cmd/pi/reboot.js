const {shell} = require('utils-mad');

module.exports = () => shell.run('sudo shutdown -r +1');
