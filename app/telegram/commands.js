'use strict';

const appRoot = require('app-root-path');
const {print} = require('utils-mad');
const {promises: fs} = require('fs');

/**
 * Распарсить команды из списка и поставить их боту
 * @param {object} bot
 */
const setBotCommandsList = async bot => {
    const commands = await fs.readFile(`${appRoot}/app/cmd/list.md`, {encoding: 'utf-8'});

    const list = commands.split('\n').filter(Boolean).map(elem => {
        const [command, description] = elem.split(' - ');
        return {command, description};
    });

    try {
        await bot.setMyCommands(list);
    } catch (err) {
        print.ex(err, {
            before: 'set commands error',
            exit: true,
        });
    }

    return list;
};

module.exports = {setBotCommandsList};
