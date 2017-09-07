const fs = require("fs");
const program = require("./lib/program");
const webdriver = require('selenium-webdriver');

const ActionExecutor = require("./lib/ActionExecutor");
const ActionParser = require("./lib/ActionParser");
const Properties = require("./lib/Properties");

// Parse command line arguments
program.parse(process.argv);

// Parse all properties, first from file, then override from arguments in the command line
let properties = new Properties();
program.propertyFile.forEach(configFile => properties.addFromFile(configFile));
properties.addAll(program.property);
console.info(`Properties are: ${JSON.stringify(properties.getAll())}`);

// Store information about actions that will be executed, in order
// Each action will be stored with a `name` and `arguments` properties.
const actionsToExecute = [];

const actionParser = new ActionParser(properties.getAll());

// Do we have a script to read from?
if (program.script) {
  // Read actions from script, line-by-line
  fs.readFileSync(program.script, "utf-8")
    .split("\n")
    .filter(Boolean)
    .forEach(exec => actionsToExecute.push(actionParser.parse(exec)));
} else {
  // Get all actions from arguments passed in
  program.execute.forEach(exec => actionsToExecute.push(actionParser.parse(exec)));
}

if (actionsToExecute.length == 0) {
  console.info("Nothing to do!");
} else {
  // Initialize the webdriver
  const driver = new webdriver.Builder()
    .forBrowser("chrome")
    .build();

  let executor = new ActionExecutor(program.action, driver, properties.getAll());

  // When done, close the browser session
  executor.on("done", () => driver.close());

  console.info(`Executing the following actions: ${actionsToExecute.map(a => a.name).join(", ")}`);
  executor.executeAll(actionsToExecute);
}
