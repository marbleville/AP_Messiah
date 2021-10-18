require('dotenv').config();
const { Client, MessageEmbed, Intents, MessageButton, CommandInteractionOptionResolver } = require('discord.js');
const fs = require('fs');
const paginationEmbed = require('discordjs-button-pagination');
const db = require('./db.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] });
const token = process.env.TOKEN;

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
                let p = '';
                fs.readdirSync('./commands').forEach(file => {
                    p += `/${file.split('.')[0]}\n`
                })
                const Embed = new MessageEmbed()
                    .setTitle('**Help Page:**')
                    .addField('**Commands**', s)
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
                //adds all class rosters to the array
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
                    .addField('Get Help:', 'Class of 2022 Advanced Placement Discord server serves as a hub for study materials and help from fellow AP students.')
                    .addField('Features:', 'This bot tracks students in this server of all AP classes offered by MHS with `/classes`, `/enroll`, and `/unenroll`. It also keeps track of different study materials that members have posted with `/study`')
                    .addField('\u200B', 'Class of 2022 Advanced Placement managed by <@703028154431832094>. Bot written by <@464156671024037918>. Credit for original idea goes to <@371318217454387211>. ')
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

            case 'getquizlet':
                if (interaction.options._subcommand === 'list') {
                    let pages1 = [];
                    let names = db.getQuizletLinks(interaction.options._hoistedOptions[0].value).chunk_inefficient(config.quizletLinkPageLength);
                    names.forEach(n => {
                        let s = '';
                        //makes a string with names and links for all quizlet so you cann look at them inn the browser as well
                        n.forEach(f => s += `**${f.split('/')[f.split('/').length - 2]}:** ${f}\n`);
                        const Embed4 = new MessageEmbed()
                            .setTitle(`Quizlets for ${roles[interaction.options._hoistedOptions[0].value].name}`)
                            .setColor('BLURPLE')
                            .addField('Quizlets:', s)
                        pages1.push(Embed4);
                    })
                    //interactions for fancy
                    const button3 = new MessageButton()
                        .setCustomId("previousbtn")
                        .setLabel("Previous")
                        .setStyle("DANGER");

                    const button4 = new MessageButton()
                        .setCustomId("nextbtn")
                        .setLabel("Next")
                        .setStyle("SUCCESS");
                    const buttonList1 = [button3, button4];
                    const timeout1 = config.paginationTimeout;
                    //npm module to do this easily
                    paginationEmbed(interaction, pages1, buttonList1, timeout1);
                } else if (interaction.options._subcommand === 'study') {
                    try {
                        interaction.reply('Sorry but this feature is not working :( (Blame Quizlet for being dumb)')
                    } catch(error) {
                        console.log(error);
                    }
                }   
            break;
        }
    }
});

Object.defineProperty(Array.prototype, 'chunk_inefficient', {
    value: function(chunkSize) {
      var array = this;
      return [].concat.apply([],
        array.map(function(elem, i) {
          return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        })
      );
    }
  });

bot.login(token);