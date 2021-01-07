'use strict';

const appRoot = require('app-root-path');
const reply = require('../telegram/reply');
const {print} = require('utils-mad');
const {promises: fs} = require('fs');
const {shell} = require('utils-mad');

/**
 * Распарсить команды из списка и поставить их боту
 * @param {object} bot
 * @returns {Array}
 */
const setBotCommandsList = async bot => {
    const commands = await fs.readFile(`${appRoot}/app/cmd/list.md`, {encoding: 'utf-8'});

    const list = commands.split('\n').filter(Boolean).map(elem => {
        const [command, description] = elem.split(' - ');
        return {command, description};
    });

    const bin = await shell.run('npm bin -g');
    const ls = await shell.run(`ls ${bin}`);

    ls.split(/\s+/).forEach(command => {
        if (command.match(/^mad_([a-z]+_[a-z]+)$/)) {
            list.push({command, description: 'global'});
            reply(bot, command, shell.run, command);
        }
    });

    try {
        await bot.setMyCommands(list);
    } catch (err) {
        print.ex(err, {
            before: 'setMyCommandsErr',
            exit: true,
        });
    }

    return list;
};

module.exports = {setBotCommandsList};
