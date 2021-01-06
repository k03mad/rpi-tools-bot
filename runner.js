'use strict';

const all = require('require-all')(`${__dirname}/app/cmd`);

const [path, file, ...arg] = process.env.npm_config_name.split('/');

(async () => {
    const log = await all[path][file](arg.join(' '));
    console.log(log);
})();
