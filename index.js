require('dotenv').config();
const { Client, MessageEmbed, Intents, MessageButton } = require('discord.js');
const { NeuralNetwork } = require('@nlpjs/neural');
const fs = require('fs');
const paginationEmbed = require('discordjs-button-pagination');
const db = require('./db.js');
const { Interaction } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] });
const token = process.env.TOKEN;

const config = JSON.parse(fs.readFileSync('./other/config.json', 'utf8'));

// const corpus = require('./corpus.json');
// let net = new NeuralNetwork();
// net.train(corpus);
// const exported = net.toJSON();
// fs.writeFileSync('./model.json', JSON.stringify(exported));

let net = new NeuralNetwork();
net.fromJSON(JSON.parse(fs.readFileSync('./other/model.json')));

let c = fs.readdirSync('./classes');
let mat = fs.readdirSync('./materials');

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
//     bot.channels.cache.get('899501718507757631').send(x.join(' '));
// })

bot.on('ready', () => {
    bot.user.setActivity('that AP grind | /help');
    console.log('Bot Online!')
})

bot.on('guildMemberUpdate', (oldMember, newMember) => {
    if (oldMember._roles.length != newMember._roles.length) {
        let roleName1 = '';
        let roleName2 = '';
        for (const [key, value] of Object.entries(roles)) {
            if (value.id === oldMember._roles.filter(x => !newMember._roles.includes(x))[0] ) {
                roleName1 = key;
            }
            if (value. id === newMember._roles.filter(x => !oldMember._roles.includes(x))[0]) {
                roleName2 = key;
            }
        }
        if (roles[roleName1] != undefined) {
            //removed role
            for (const [key, value] of Object.entries(roles)) {
                if (value.id === oldMember._roles.filter(x => !newMember._roles.includes(x))[0]) {
                    let y = db.getClass(key);
                    y.splice(y.indexOf(newMember.id), 1);
                    db.writeClass(key, y);
                }    
            }
        } else if (roles[roleName2] != undefined) {
            //added role
            for (const [key, value] of Object.entries(roles)) {
                if (value.id === newMember._roles.filter(x => !oldMember._roles.includes(x))[0]) {
                    let y = db.getClass(key);
                    y.push(newMember.id);
                    db.writeClass(key, y);
                }    
            }
        }
    }

})

bot.on('messageCreate', message => {
    let m = {};
    let o = message.content.toLowerCase().split(' ');
    o.forEach(element => {
        m[element] = 1;
    })
    let h = net.run(m);
    if (h.help > 0.8 && h.give < 0.2) {
        let l = `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
        const embed = new MessageEmbed()
            .setTitle('**Help Needed:**')
            .addField(`\u200B`, `**<@${message.author.id}> might need help:**\n` + '`' + message.content + '`')
            .addField('**Link:**', l)
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
                    .addField('**Commands**', p)
                    .setColor('BLURPLE')
                    .setThumbnail(bot.user.avatarURL())
                    .addField('\u200B', 'https://github.com/marbleville/AP_Messiah\nPlease report any bugs with the bot to <@464156671024037918>.')
                interaction.reply({ embeds: [Embed] } );
            break;

            case 'enroll':
                let m = interaction.guild.members.cache.get(interaction.user.id);
                //adds proper role to user
                if (!interaction.member.roles.cache.some(role => role.id === roles[interaction.options._hoistedOptions[0].value].id)) {
                    m.roles.add(interaction.guild.roles.cache.find((r) => r.id === roles[interaction.options._hoistedOptions[0].value].id));
                    //gets and updates the class roster
                    let d = db.getClass(interaction.options._hoistedOptions[0].value);
                    d.push(interaction.user.id.toString());
                    db.writeClass(interaction.options._hoistedOptions[0].value, d);
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
                if (interaction.options._subcommand === 'server') {
                    //add paginnation with stats on server
                    const Embed3 = new MessageEmbed()
                        .setTitle('**Info about AP Discord Server**')
                        .setColor('BLURPLE')
                        .addField('Get Help:', 'Class of 2022 Advanced Placement Discord server serves as a hub for study materials and help from fellow AP students.')
                        .addField('Features:', 'This bot tracks students in this server of all AP classes offered by MHS with `/classes`, `/enroll`, and `/unenroll`. It also keeps track of different study materials that members have posted with `/quizlet`.')
                        .addField('\u200B', 'Class of 2022 Advanced Placement managed by <@703028154431832094>. Bot written by <@464156671024037918>. Credit for original idea goes to <@371318217454387211>. ')
                    const statEmbed = new MessageEmbed()
                        .setTitle('**Server Statistics**')
                        .setColor('BLURPLE')
                        .addField('**Member Count:**', `${interaction.guild.memberCount} scholars`)
                        .addField('**Class List:**', fs.readdirSync('./classes').reduce((acc, cur) => acc + `${roles[cur.split('.')[0]].name}\n`, ''))

                    const statBtn = new MessageButton()
                        .setCustomId("previousbtn")
                        .setLabel("Back")
                        .setStyle("DANGER");

                    const statBtn2 = new MessageButton()
                        .setCustomId("nextbtn")
                        .setLabel("See Stats")
                        .setStyle("SUCCESS");
                    let embeds = [Embed3, statEmbed]
                    const buttonList1 = [statBtn, statBtn2];
                    const t1 = config.paginationTimeout;
                    paginationEmbed(interaction, embeds, buttonList1, t1);
                } else if (interaction.options._subcommand === 'user') {
                    let name = '';
                    if (interaction.options._hoistedOptions[0].member.nickname != undefined) {
                        name = interaction.options._hoistedOptions[0].member.nickname;
                    } else {
                        name = interaction.options._hoistedOptions[0].user.usernname;
                    }
                    const embed = new MessageEmbed()
                        .setTitle(`**${name}** information`)
                        .setColor('BLURPLE')
                        .addField('Join Rank:', `**${name}** was the ${getJoinRank(interaction.options._hoistedOptions[0].value, interaction.guild)} user to join on ${interaction.options._hoistedOptions[0].member.joinedAt.toString().slice(0, 15)}.`)
                        //add feild here with karma info shizzle
                    interaction.reply({ embeds: [embed] });
                }
            break;

            case 'quizlet':
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
                    if (pages1[0] === undefined) {
                        //protection for no links
                        const Embed4 = new MessageEmbed()
                            .setTitle(`Quizlets for ${roles[interaction.options._hoistedOptions[0].value].name}`)
                            .setColor('BLURPLE')
                            .addField('Quizlets:', 'Sorry no Quizlets yet for this class.')
                        pages1.push(Embed4);
                    }
                    paginationEmbed(interaction, pages1, buttonList1, timeout1);
                } else if (interaction.options._subcommand === 'study') {
                    try {
                        interaction.reply('Sorry but this feature is not working :( (Blame Quizlet for being dumb)')
                    } catch(error) {
                        console.log(error);
                    }
                } else if (interaction.options._subcommand === 'add') {
                    if (!/^(http|https):\/\/quizlet.com\/[^ "]+$/.test(interaction.options._hoistedOptions[1].value)) {
                        interaction.reply({content: 'Please provide a valid link to a Quizlet study set.', ephemeral: true});
                    } else {
                        db.writeQuizlet(interaction.options._hoistedOptions[0].value, interaction.options._hoistedOptions[1].value);
                        interaction.reply(`Quizlet saved for **${roles[interaction.options._hoistedOptions[0].value].name}** as **${interaction.options._hoistedOptions[1].value.split('/')[interaction.options._hoistedOptions[1].value.split('/').length - 2]}**.`)
                    }
                }
            break;

            case 'remind':
                let valid = true;
                if (interaction.options._hoistedOptions[1].value.split(' ').length === 2) {
                    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(interaction.options._hoistedOptions[1].value.split(' ')[0])) {
                        valid = false;
                        interaction.reply({ content: 'Please provide a valid date.', ephemeral: true });
                    } else if (!/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/.test(interaction.options._hoistedOptions[1].value.split(' ')[1])) {
                        valid = false;
                        interaction.reply({ content: 'Please provide a valid time.', ephemeral: true });
                    }
                } else {
                    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(interaction.options._hoistedOptions[1].value)) {
                        valid = false;
                        interaction.reply({ content: 'Please provide a valid date.', ephemeral: true });
                    }
                }
                if (valid) {
                    let reminder = {
                        class: roles[interaction.options._hoistedOptions[0].value].id,
                        date: interaction.options._hoistedOptions[1].value.split(' ')[0],
                        time: '',
                        message: interaction.options._hoistedOptions[2].value
                    }
                    if (interaction.options._hoistedOptions[1].value.split(' ').length === 2) {
                        reminder.time = interaction.options._hoistedOptions[1].value.split(' ')[1];
                    }
                    let reminders = JSON.parse(fs.readFileSync('./other/reminders', 'utf8'));
                    reminders.push(reminder);
                    fs.writeFileSync('./other/reminders', JSON.stringify(reminders));
                    let dateTime = '';
                    if (interaction.options._hoistedOptions[1].value.split(' ') === 2) {
                        dateTime += `${interaction.options._hoistedOptions[1].value.split(' ')[0]} at ${interaction.options._hoistedOptions[1].value.split(' ')[1]}`;
                    } else {
                        dateTime += `${interaction.options._hoistedOptions[1].value}`;
                    }
                    interaction.reply(`${roles[interaction.options._hoistedOptions[0].value].name} reminder set for ${dateTime}`);
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

function getJoinRank(ID, guild) { 
    if (!guild.members.cache.get(ID)) return; 
    let idx = -1;
    guild.members.cache.sorted((a, b) => a.joinedAt - b.joinedAt).reduce((accum, cur, curKey, col) => {
        accum ++;
        if (curKey === ID) {
            idx = accum;
        }
        return accum;
    }, -1);

    return `${idx}${getNumSuffix(idx)}`;
}

function getNumSuffix(num) {
    let lastDigit = num % 10;
    let last2Digits = num % 100;
    const digitToOrdinalSuffix = {
        1: 'st',
        2: 'nd',
        3: 'rd'
      }
    return lastDigit === 0 || lastDigit > 3 ||
          last2Digits >= 11 && last2Digits <= 13
            ? 'th'
            : digitToOrdinalSuffix[lastDigit]
}

//returns an array of all reminders that need action
function checkReminder() {
    let response = [];
    let reminders = JSON.parse(fs.readFileSync('./other/reminders', 'utf8'));
    let UTC;
    reminders.forEach(r => {
        if (r.time != '') {
            let time = r.date.concat(` ${r.time}`).split(/\/|\:| /);
            if (time[5] === 'pm') {
                time[3] += 12
            } 
            UTC = new Date(Date.UTC(time[2], time[0], time[1], time[3], time[4])).getTime();
        } else {
            let time = r.date.split('/');
            UTC = new Date(Date.UTC(time[2], time[0], time[1], 8, 0)).getTime();
        }
        if (Date.now() > UTC) {
            //I FUCKING FORGOT THE REMINDER MESSAGE || TIME FOR REFACTOR!!!!!!
            response.push();
        }
    })
}

bot.login(token);