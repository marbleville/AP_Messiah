const fs = require('fs');

function writeClass(name, roster) {
    //might have to refractor to add karma systems but for now just sorting names
    try {
        fs.writeFileSync(`./classes/${name}.json`, JSON.stringify(roster));
    } catch(error) {
        console.log(error);
    }
}

function getClass(name) {
    let c = [];
    try {
        fs.readdirSync('./classes').forEach(file => {
            if (file === `${name}.json`) {
                c = JSON.parse(fs.readFileSync(`./classes/${file}`, 'utf8'));
            }
        })
    } catch(error) {
        console.log(error);
    }
    return c;
}

function getAllClasses() {
    let classes = [];
    try {
        let dir = fs.readdirSync('./classes');
        dir.forEach(c => {
            classes.push({name: c, roster: JSON.parse(fs.readFileSync(`./classes/${c}`, 'utf8')) });
        })
    } catch(error) {
        console.log(error);
    }   
    return classes;
}

module.exports = { writeClass, getClass, getAllClasses }