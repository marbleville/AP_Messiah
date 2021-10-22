const fs = require('fs');

//takes the small name and an array to write a class
function writeClass(name, roster) {
    //might have to refractor to add karma systems etc. but for now just the roster
    try {
        fs.writeFileSync(`./classes/${name}.json`, JSON.stringify(roster));
    } catch(error) {
        console.log(error);
    }
}

function getClass(name) {
    let c = [];
    try {
        c = JSON.parse(fs.readFileSync(`./classes/${name}.json`, 'utf8'));
    } catch(error) {
        console.log(error);
    }
    return c;
}

function getAllClasses() {
    let classes = [];
    try {
        classes.push({name: c, roster: JSON.parse(fs.readFileSync(`./classes/${c}.json`, 'utf8')) });
    } catch(error) {
        console.log(error);
    }   
    return classes;
}

function writeQuizlet(c, link) {
    try { 
        let links = JSON.parse(fs.readFileSync(`./materials/${c}.json`, 'utf8'));
        links.push({name: link.split('/')[link.split('/').length - 2], link: link});
        fs.writeFileSync(`./materials/${c}.json`, JSON.stringify(links));
    } catch(error) {
        console.log(error);
    }
}

function getQuizletLink(c, name) {
    let link = '';
    try {
        let links = JSON.parse(fs.readFileSync(`./materials/${c}.json`, 'utf8'));
        links.forEach(l => {
            if (l.name === name) {
                link = l.link;
            }
        })
        return link;
    } catch(error) {
        console.log(error);
    }
}

function getQuizletLinks(c) {
    let l = [];
    try {
        let links = JSON.parse(fs.readFileSync(`./materials/${c}.json`, 'utf8'));
        links.forEach(n => {
            l.push(n.link);
        })
        return l;
    } catch(error) {
        console.log(error);
    }
}

//returns an array of all reminders that need action
function getNeededReminders() {
    let response = [];
    let reminders = JSON.parse(fs.readFileSync('./other/reminders.json', 'utf8'));
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
            //TEHE
            response.push({id: r.class, message: r.message, time: UTC.toString() });
        }
    })
    return response;
}

//this is a little weird but okay
function removeReminder(c, date) {
    let r = false;
    let idx = -1;
    let save = -1;
    let rem = JSON.parse(fs.readFileSync('./other/reminders.json', 'utf8'))
    rem.forEach(reminder => {
        idx++;
        if (reminder.class === c && (reminder.date.concat(` ${reminder.time}` === date))) {
            save = idx;
        }
    })
    if (save != -1) {
        let rmv = rem.splice(save, 1);
        fs.writeFileSync('./other/reminders', JSON.stringify(rem));
        r = true;     
    }
    return r;
}


module.exports = { writeClass, getClass, getAllClasses, writeQuizlet, getQuizletLink, getQuizletLinks, getNeededReminders, removeReminder }