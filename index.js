require('dotenv').config();
const { Client, MessageEmbed, Intents, MessageButton } = require('discord.js');
const { NeuralNetwork } = require('@nlpjs/neural');
const fs = require('fs');
const paginationEmbed = require('discordjs-button-pagination');
const db = require('./db.js');
const { Interaction } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const token = process.env.TOKEN;
const config = JSON.parse(fs.readFileSync('./other/config.json', 'utf8'));
let net = new NeuralNetwork()
net.fromJSON(JSON.parse(fs.readFileSync('./other/model.json')));
// const corpus = require('./corpus.json');
// let net = new NeuralNetwork();
// net.train(corpus);
// const exported = net.toJSON();
// fs.writeFileSync('./model.json', JSON.stringify(exported));

let em = ['📊', '📈', '💻', '🖥️', '🤾‍♂️', '🏋️‍♂️', '🔥', '🌳', '🖊️', '📖', '🏛️', '⚜️', '🌎', '🎨', '🛡️', '🐮', '🇫🇷', '🎵'];

const er = new MessageEmbed()
    .setTitle('**Enroll in Classes:**')
    .addField('React below to join a class.', '📊: AP Statistics\n📈:AP Calculus AB/BC\n💻: AP CSA\n🖥️: AP CSP\n🤾‍♂️: AP Physics\n🏋️‍♂️: AP Biology\n🔥: AP Chemistry\n🌳: AP Environment\n🖊️: AP Language\n📖: AP Literature\n🏛️: AP Government\n⚜️: AP Euro\n🌎: APUSH\n🎨: AP Art\n🛡️: AP Latin\n🐮: AP Spanish\n🇫🇷: AP French\n🎵: AP Music Theory')
    .setColor('BLURPLE')

//checks reminders every minute
setInterval(() => {
    db.getNeededReminders().forEach(reminder => {
        bot.guild.channels.cahce.get('900746543672463390').send(`<@${reminder.id}>, ${reminder.message} at ${reminder.time}`)
    })
}, 60000)

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
    music:   { name: 'AP Music Theory', id: '899704750977724467' }
}

//could be fun(sends messages from console to discord)
// let y = process.openStdin();
// y.addListener('data', res => {
//     let x = res.toString().trim().split(/ +/g);
//     bot.channels.cache.get('899501718507757631').send(x.join(' '));
// })

bot.on('ready', () => {
    bot.user.setActivity('that AP grind | /help');
    console.log('Bot Online!');
    bot.channels.cache.get('899511003077808158').messages.fetch({ limit: 10 });
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
                    let rmv = y.splice(y.indexOf(newMember.id), 1);
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

bot.on('messageReactionAdd', (messageReaction, user) => {
    if (user.bot) return;
    const { message, _emoji } = messageReaction;
    
    switch(_emoji.name) {
        case '📊':
            addRole('stat', user, message);
        break;

        case '📈':
            addRole('calc', user, message);
        break;
        
        case '💻':
            addRole('csa', user, message);
        break;
    
        case '🖥️':
            addRole('csp', user, message);
        break;
        
        case '🤾‍♂️':
            addRole('phys', user, message);
        break;

        case '🏋️‍♂️':
            addRole('bio', user, message);
        break;

        case '🔥':
            addRole('chem', user, message);
        break;

        case '🌳':
            addRole('enviro', user, message);
        break;

        case '🖊️':
            addRole('lang', user, message);
        break;

        case '📖':
            addRole('lit', user, message);
        break;

        case '🏛️':
            addRole('gov', user, message);
        break;

        case '⚜️':
            addRole('euro', user, message);
        break;

        case '🌎':
            addRole('apush', user, message);
        break;

        case '🎨':
            addRole('arthist', user, message);
        break;

        case '🛡️':
            addRole('spqr', user, message);
        break;

        case '🐮':
            addRole('span', user, message);
        break;

        case '🇫🇷':
            addRole('frank', user, message);
        break;

        case '🎵':
            addRole('music', user, message);
        break;
    }
})

bot.on('messageReactionRemove', (messageReaction, user) => {
    if (user.bot) return;
    const { message, _emoji } = messageReaction;
    
    switch(_emoji.name) {
        case '📊':
            rmvRole('stat', user, message);
        break;

        case '📈':
            rmvRole('calc', user, message);
        break;
        
        case '💻':
            rmvRole('csa', user, message);
        break;
    
        case '🖥️':
            rmvRole('csp', user, message);
        break;
        
        case '🤾‍♂️':
            rmvRole('phys', user, message);
        break;

        case '🏋️‍♂️':
            rmvRole('bio', user, message);
        break;

        case '🔥':
            rmvRole('chem', user, message);
        break;

        case '🌳':
            rmvRole('enviro', user, message);
        break;

        case '🖊️':
            rmvRole('lang', user, message);
        break;

        case '📖':
            rmvRole('lit', user, message);
        break;

        case '🏛️':
            rmvRole('gov', user, message);
        break;

        case '⚜️':
            rmvRole('euro', user, message);
        break;

        case '🌎':
            rmvRole('apush', user, message);
        break;

        case '🎨':
            rmvRole('arthist', user, message);
        break;

        case '🛡️':
            rmvRole('spqr', user, message);
        break;

        case '🐮':
            rmvRole('span', user, message);
        break;

        case '🇫🇷':
            rmvRole('frank', user, message);
        break;

        case '🎵':
            rmvRole('music', user, message);
        break;
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
        let l = `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
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
                if (interaction.options._subcommand === 'add') {
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
                } else if (interaction.options._subcommand === 'remove') {
                    if (db.removeReminder(roles[interaction.options._hoistedOptions[0].value].id, interaction.options._hoistedOptions[1].value)) {
                        interaction.reply(`Removed reminder for **${roles[interaction.options._hoistedOptions[0].value].name}**.`)
                    } else {
                        interaction.reply(`No such reminder for **${roles[interaction.options._hoistedOptions[0].value].name}**.`)
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

function addRole(name, user, message) {
    let m = message.guild.members.cache.get(user.id);
    let roster = db.getClass(name);
    roster.push(user.id);
    db.writeClass(name, roster);
    m.roles.add(message.guild.roles.cache.find((r) => r.id === roles[name].id));
}

function rmvRole(name, user, message) {
    let m = message.guild.members.cache.get(user.id);
    m.roles.remove(message.guild.roles.cache.find((r) => r.id === roles[name].id));
    //accesses and spliced out the unenrolled user
    let temp = db.getClass(name);
    let rmv = temp.splice(temp.indexOf(user.id), 1);
    db.writeClass(name, temp);
}

bot.login(token);