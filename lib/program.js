const program = require('commander');

/* eslint-disable no-param-reassign */
function addProperty(nameValue, all) {
  const [name, value] = nameValue.split('=');
  all[name] = value;
  return all;
}
/* eslint-enable no-param-reassign */

function addToList(value, all) {
  all.push(value);
  return all;
}

program
  .version('0.1.0')
  .usage('[options] {-e command|-s path-to-script}')
  .description(`
A facilitator to automate repetitive tasks using Selenium.

You can create your actions to be executed and store them in some shared directory.
They can be configured through properties passed in through a configuration file or
individually from the command line. Then you can call your actions passing arguments
to them. A simple example would be to login and do some action:

  node index.js -p username=john -p password=mypass \\
    -a ~/myActionsDirectory \\
    -e Login \\
    -e "CreateToDo('Buy milk')"

Or you could add all the things you want to execute and all the configuration like
username and password into a configuratio file and call it in the following way:

  node index.js -c myconfiguration.yml -s createToDoScript.js`)

  .option(
    '-a --action [path]',
    'Path to directory where to read actions from, can provide more than one',
    addToList,
    [],
  )

  .option(
    '-e --execute [action]',
    'Action to execute and the parameters if any, can provide more than one.',
    addToList,
    [],
  )

  .option(
    '-f --property-file [path]',
    'Yaml file to read properties from, can provide more than one.' +
    ' Properties passed in using -p will override the ones coming from the file',
    addToList,
    [],
  )

  .option(
    '-p --property [property=value]',
    'Set a property that will be passed into actions.',
    addProperty,
    {},
  )

  .option(
    '-s --script [path]',
    'Path to a script file where each line will be read as an action to be executed.' +
    ' Enabling this will ignore any execute action passed in.',
  );

module.exports = program;
