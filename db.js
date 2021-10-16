const fs = require('fs');

writeClass();

function writeClass(name, roster) {
    //might have to refractor to add karma systems but fo no just sotring names
    fs.writeFileSync(`./classes/${name}.json`, JSON.stringify(roster));
}