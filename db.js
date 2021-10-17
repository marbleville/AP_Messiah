const { CommandInteractionOptionResolver } = require('discord.js');
const fs = require('fs');

function writeClass(name, roster) {
    //might have to refractor to add karma systems but for now just sotring names
    try {
        fs.writeFileSync(`./classes/${name}.json`, JSON.stringify(roster));
    } catch(error) {
        console.log(error);
    }
}

function getClass(name) {
    let c = undefined;
    fs.readdirSync('./classes').forEach(file => {
        if (file === name) {
            c = JSON.parse(fs.readFileSync(`./classes/${file}`, 'utf8'));
        }
    })
    return c;
}

module.exports = { writeClass, getClass }