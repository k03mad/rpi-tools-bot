const {run} = require('../../../utils');

/**
 * Install node updates
 */
module.exports = () => run('nvm install node --reinstall-packages-from=node', true);
