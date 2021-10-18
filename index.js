require('dotenv').config();
const { Client, MessageEmbed, Intents, MessageButton } = require('discord.js');
const fs = require('fs');
const getCards = require('quizlet-fetcher');
const paginationEmbed = require('discordjs-button-pagination');
const db = require('./db.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] });
const token = process.env.TOKEN;

//cause why not?
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

//makes trakcinng roles and full names easier
const roles = {
    stat:    { name: 'AP Statistics', id: '899345588477390909' },
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

bot.on('messageCreate', message => {
    
})

bot.on('interactionCreate', interaction => {
	if (interaction.isCommand()) {
        switch (interaction.commandName) {
            case 'help':
                const Embed = new MessageEmbed()
                    .setTitle('**Help Page:**')
                    .addField('**Commands**', '/help\n/enroll\n/unenroll\n/info')
                    .setColor('BLURPLE')
                    .addField('\u200B', 'https://github.com/marbleville/AP_Messiah\nPlease report any bugs with the bot to <@464156671024037918>.')
                interaction.reply({ embeds: [Embed] } );
            break;

            case 'enroll':
                let m = interaction.guild.members.cache.get(interaction.user.id);
                //adds proper role to user
                if (!message.member.roles.cache.some(role => role.id === roles[interaction.options._hoistedOptions[0].value].id)) {
                    m.roles.add(interaction.guild.roles.cache.find((r) => r.id === roles[interaction.options._hoistedOptions[0].value].id));
                    //gets and updates the class roster
                    let c = db.getClass(interaction.options._hoistedOptions[0].value);
                    c.push(interaction.user.id.toString());
                    db.writeClass(interaction.options._hoistedOptions[0].value, c);
                    interaction.reply(`Added to **${roles[interaction.options._hoistedOptions[0].value].name}**.`);
                } else {
                    interaction.reply('You are already innn this class.')
                }
            break;

            case 'unenroll':
                let g = interaction.guild.members.cache.get(interaction.user.id);
                //removes role 
                g.roles.remove(interaction.guild.roles.cache.find((r) => r.id === roles[interaction.options._hoistedOptions[0].value].id));
                //accesses and spliced out the unenrolled user
                let temp = db.getClass(interaction.options._hoistedOptions[0].value);
                let rmv = temp.splice(temp.indexOf(interaction.user.id), 1);
                db.writeClass(interaction.options._hoistedOptions[0].value, temp);
                interaction.reply(`Removed from **${roles[interaction.options._hoistedOptions[0].value].name}**.`);
            break;

            case 'classes':
                let classes = db.getAllClasses();
                let pages = [];
                //adds all clas rosters to the array
                classes.forEach(c => {
                    let Embed2 = new MessageEmbed()
                        .setTitle(roles[c.name.split('.')[0]].name)
                        .setColor('BLURPLE')
                        let s = 'No students right now.';
                        if (c.roster != []) {
                            c.roster.forEach(student => {
                                s += `<@${student}>\n`;
                            })
                        }
                        Embed2.addField('Roster:', s);
                    pages.push(Embed2);
                })
                //interactions for fancy
                const button1 = new MessageButton()
                    .setCustomId("previousbtn")
                    .setLabel("Previous")
                    .setStyle("DANGER");

                const button2 = new MessageButton()
                    .setCustomId("nextbtn")
                    .setLabel("Next")
                    .setStyle("SUCCESS");
                const buttonList = [button1, button2];
                const timeout = config.paginationTimeout;
                //npm module to do this easily
                paginationEmbed(interaction, pages, buttonList, timeout);
            break;

            case 'info':
                const Embed3 = new MessageEmbed()
                    .setTitle('**Info about AP Discord Server**')
                    .addField('Get Help:', 'This server serves as a hub for study materials and help from fellow AP students.')
                    .addField('Features:', 'This bot tracks students in this server of all AP classes offered by MHS with `/classes`, `/enroll`, and `/unenroll`. It also keeps track of different study materials that members have posted with `/study`')
                    .addField('\u200B', 'AP Discord Server managed by <@703028154431832094>. Bot written by <@464156671024037918>. Credit for original idea goes to <@371318217454387211>. ')
                interaction.reply({ embeds: [Embed3] });
            break;

            case 'addquizlet':
                if (!/^(http|https):\/\/quizlet.com\/[^ "]+$/.test(interaction.options._hoistedOptions[1].value)) {
                    interaction.reply('Please provide a link to a Quizlet study set.');
                } else {
                    db.writeQuizlet(interaction.options._hoistedOptions[0].value, interaction.options._hoistedOptions[1].value);
                    interaction.reply(`Quizlet saved for **${roles[interaction.options._hoistedOptions[0].value].name}** as **${interaction.options._hoistedOptions[1].value.split('/')[5]}**.`)
                }
            break;


        }
    }
});

bot.login(token);