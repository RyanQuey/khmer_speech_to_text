// run to convert the txt file in this directory to a .json file for easy reading by our app
const fs = require('fs'),
  path = require('path'),    
  filePath = path.join(__dirname, 'preferred-spellings.txt');

console.log("starting")
fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
  if (!err) {
    // some have multiple alt spellings. Split those into two entries with the same preferred
    // spelling on the right
    // run five times. Two should be plenty, but why not
    for (let i=0; i < 5; i++) {
      data = data.replace(/(.*)\|(.*)=(.*)\n/gi, "$1=$3\n$2=$3\n")
    }

    
    // convert to json
    data = data.replace(/(.*)=(.*)\n/gi, "\"$1\": \"$2\",\n")
    // remove final comma
    data = data.replace(/\,\n\s*$/, "")
    // add some curlies
    data = "{" + data + "}"
    
    fs.writeFileSync('../../src/helpers/preferred-spellings.json', data);
    console.log("done")
  } else {
    console.error("error", err);
  }
});
