require('dotenv').config();
const { Client, MessageEmbed, Intents, MessageButton } = require('discord.js');
const getCards = require('quizlet-fetcher');
const db = require('./db.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] });
const token = process.env.TOKEN;

const roles = {
    stat:    { name: 'AP Statistics', id: '' },
    calc:    { name: 'AP Calculus AB/BC', id: '' },
    csa:     { name: 'AP Computer Science A', id: '' },
    csp:     { name: 'AP Computer Science Principles', id: '' },
    phys:    { name: 'AP Physics', id: '' },
    bio:     { name: 'AP Biology', id: '' },
    chem:    { name: 'AP Chemistry', id: '' },
    enviro:  { name: 'AP Environmental Science', id: '' },
    lang:    { name: 'AP Language and Composition', id: '' },
    lit:     { name: 'AP Literature and Composition', id: '' },
    gov:     { name: 'AP Government and Politics', id: '' },
    euro:    { name: 'AP European History', id: '' },
    apush:   { name: 'AP US History', id: '' },
    arthist: { name: 'AP Art History', id: '' },
    spqr:    { name: 'AP Latin', id: '' },
    span:    { name: 'AP Spanish', id: '' },
    frank:   { name: 'AP French', id: '' },
    music:   { name: 'AP Music Theory', id: '' }
}

bot.on('ready', () => {
    bot.user.setActivity('that AP grind | /help');
    console.log('Bot Online!')
})

bot.on('interactionCreate', interaction => {
	if (interaction.isCommand()) {
        switch (interaction.commandName) {
            case 'help':
                const Embed = new MessageEmbed()
                    .setTitle('**Help Page:**')
                    .addField('**Commands**', '/help\nand more comeing!')
                interaction.reply({ embeds: [Embed] } );
            break;

            case 'enroll':
                let m = interaction.guild.members.cache.get(interaction.user.id);
                m.roles.add(interaction.guild.roles.cache.find((r) => r.id === roles[interaction.options._hoistedOptions[0].value].id));
                interaction.reply(`Added to **${roles[interaction.options._hoistedOptions[0].value].name}**.`);
            break;

            case 'unenroll':
                let g = interaction.guild.members.cache.get(interaction.user.id);
                g.roles.remove(interaction.guild.roles.cache.find((r) => r.id === roles[interaction.options._hoistedOptions[0].value].id));
                interaction.reply(`Removed from **${roles[interaction.options._hoistedOptions[0].value].name}**.`);
            break;

            case 'clesses':
                //I need db support here
            break;
        }
    }
});

bot.login(token);