const logic = require('./countryWiseLogic').ReadData;
let result = null;
var cmdArgs = process.argv;
let args = cmdArgs[2];
if (!args) {
    result = 'No argument passed';
} else {
    result = logic(args);
}
console.log(result);