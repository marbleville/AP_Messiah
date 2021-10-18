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

module.exports = { writeClass, getClass, getAllClasses, writeQuizlet, getQuizletLink, getQuizletLinks }