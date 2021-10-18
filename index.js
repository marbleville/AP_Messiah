require('dotenv').config();
const { Client, MessageEmbed, Intents, MessageButton, CommandInteractionOptionResolver } = require('discord.js');
const { NeuralNetwork } = require('@nlpjs/neural');
const fs = require('fs');
const paginationEmbed = require('discordjs-button-pagination');
const db = require('./db.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] });
const token = process.env.TOKEN;

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// const corpus = require('./corpus.json');
// let net = new NeuralNetwork();
// net.train(corpus);
// const exported = net.toJSON();
// fs.writeFileSync('./model.json', JSON.stringify(exported));

let net = new NeuralNetwork();
net.fromJSON(JSON.parse(fs.readFileSync('./model.json')));

//makes tracking roles and full names easier
const roles = {
    stat:    { name: 'AP Statistics', id: '899703948196327504' },
    calc:    { name: 'AP Calculus AB/BC', id: '899703957662892092' },
    csa:     { name: 'AP Computer Science A', id: '899703958661136465' },
    csp:     { name: 'AP Computer Science Principles', id: '899703959483207722' },
    phys:    { name: 'AP Physics', id: '899703960137510943' },
    bio:     { name: 'AP Biology', id: '899703960615653418' },
    chem:    { name: 'AP Chemistry', id: '899703961563582534' },
    enviro:  { name: 'AP Environmental Science', id: '899703962293399602' },
    lang:    { name: 'AP Language and Composition', id: '899703963337756732' },
    lit:     { name: 'AP Literature and Composition', id: '899703963752992878' },
    gov:     { name: 'AP Government and Politics', id: '899704404326879232' },
    euro:    { name: 'AP European History', id: '899704404964433930' },
    apush:   { name: 'AP US History', id: '899704405455175730' },
    arthist: { name: 'AP Art History', id: '899704406709268480' },
    spqr:    { name: 'AP Latin', id: '899704407099326587' },
    span:    { name: 'AP Spanish', id: '899704407913005098' },
    frank:   { name: 'AP French', id: '899704749224509471' },
    music:   { name: 'AP Music Theory', id: '899704749224509471' }
}

//could be fun(sends messages from console to discord)
// let y = process.openStdin();
// y.addListener('data', res => {
//     let x = res.toString().trim().split(/ +/g);
//     bot.channels.cache.get('899706405077000242').send(x.join(' '));
// })

bot.on('ready', () => {
    bot.user.setActivity('that AP grind | /help');
    console.log('Bot Online!')
})

bot.on('messageCreate', message => {
    let m = {};
    let o = message.content.toLowerCase().split(' ');
    o.forEach(element => {
        m[element] = 1;
    })
    let h = net.run(m);
    if (h.help > 0.8 && h.give < 0.2) {
        let l = ['https://discordapp.com/channels', '/', '<server-id>', '/', '<channel-id>', '/', '<message-id>'];
        l[2] = message.guild.id;
        l[4] = message.channel.id;
        l[6] = message.id;
        const embed = new MessageEmbed()
            .setTitle('**Help Needed:**')
            .addField(`\u200B`, `**<@${message.author.id}> might need help:**\n` + '`' + message.content + '`')
            .addField('**Link:**', l.join(''))
            .setColor('RED')
        bot.channels.cache.get('899721719105847326').send({embeds: [embed]});
    }
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
                if (!interaction.member.roles.cache.some(role => role.id === roles[interaction.options._hoistedOptions[0].value].id)) {
                    m.roles.add(interaction.guild.roles.cache.find((r) => r.id === roles[interaction.options._hoistedOptions[0].value].id));
                    //gets and updates the class roster
                    let c = db.getClass(interaction.options._hoistedOptions[0].value);
                    c.push(interaction.user.id.toString());
                    db.writeClass(interaction.options._hoistedOptions[0].value, c);
                    interaction.reply({ content: `Added to **${roles[interaction.options._hoistedOptions[0].value].name}**.`, ephemeral: true});
                } else {
                    interaction.reply({ content: 'You are already in this class.', ephemeral: true })
                }
            break;

            case 'unenroll':
                let g = interaction.guild.members.cache.get(interaction.user.id);
                //removes role
                if (interaction.member.roles.cache.some(role => role.id === roles[interaction.options._hoistedOptions[0].value].id)) {
                    g.roles.remove(interaction.guild.roles.cache.find((r) => r.id === roles[interaction.options._hoistedOptions[0].value].id));
                    //accesses and spliced out the unenrolled user
                    let temp = db.getClass(interaction.options._hoistedOptions[0].value);
                    let rmv = temp.splice(temp.indexOf(interaction.user.id), 1);
                    db.writeClass(interaction.options._hoistedOptions[0].value, temp);
                    interaction.reply({ content: `Removed from **${roles[interaction.options._hoistedOptions[0].value].name}**.`, ephemeral: true });
                } else {
                    interaction.reply({ content: 'You are not in this class.', ephemeral: true })
                }
                
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
                    .addField('Features:', 'This bot tracks students in this server of all AP classes offered by MHS with `/classes`, `/enroll`, and `/unenroll`. It also keeps track of different study materials that members have posted with `/addquizlet` and `/getquizlet`.')
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