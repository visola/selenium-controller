const fs = require("fs");
const EventEmitter = require("events");

const EXPECTED_EXTENSION = ".js";
const VALID_ACTION_FILENAME = /([A-Z][a-z]+)+\.js$/;

function executeActionFile(actionPath) {
  let actionModule = eval(`
    const module = {exports:{}};
    (function () { ${fs.readFileSync(actionPath, 'utf-8')} })();
    module;`);

  return actionModule.exports;
}

function findActionFiles (actionsFolders) {
  const result = {};
  actionsFolders.forEach(actionsFolder => {
    if (!fs.existsSync(actionsFolder)) {
      console.log(`WARNING! Not a directory: "${actionsFolder}". Some actions may not be found.`);
      return;
    }

    fs.readdirSync(actionsFolder).forEach(filename => {
      if (VALID_ACTION_FILENAME.exec(filename)) {
        let path = `${actionsFolder}/${filename}`.replace(/\/\//g, "/");
        let actionName = filename.substring(0, filename.length - EXPECTED_EXTENSION.length);
        if (result[actionName] == null) {
          console.info(`Mapping action file: ${actionName} -> ${path}`);
          result[actionName] = path;
        } else {
          console.log(`WARNING! Action already mapped: ${actionName}, mapped to: ${result[actionName]}, ignoring: ${path}`);
        }
      }
    });
  });

  return result;
}

function instantiateAction(action, driver, properties) {
  try {
    return new action.class(driver, properties);
  } catch (instantiateError) {
    throw new Error(`Error while instantiating action: ${action.name}\n${instantiateError}`);
  }
}

function validateActionInstance(action) {
  let { name, instance } = action;
  if (typeof instance.execute != "function") {
    throw new Error(`Action '${name}' doesn't have an execute method.`);
  }
}

class ActionExecutor extends EventEmitter {
  constructor(actionsFolders, driver, properties) {
    super();
    this.actionInstances = {};
    this.availableActions = findActionFiles(actionsFolders);
    this.driver = driver;
    this.properties = properties;
  }

  done(callback) {
    this.doneListeners.push(callback);
  }

  execute(action) {
    const startedAt = Date.now();

    console.log(`Executing action: '${action.name}' with arguments: ${JSON.stringify(action.arguments)}`);
    const returnValue = action.instance.execute.apply(action.instance, action.arguments);

    return returnValue
      .then(() => {
        console.log(`Executed '${action.name}' in ${Date.now() - startedAt} ms`);
      });
  }

  executeAll(actions) {
    const startedAt = Date.now();
    this.instantiateActions(actions);
    actions
      .reduce((lastPromise, action) => {
        return lastPromise.then(() => this.execute(action));
      }, Promise.resolve())
      .then(() => {
        console.log(`Finished executing all actions in ${Date.now() - startedAt} ms`);
        this.emit("done")
      })
      .catch((e) => {
        console.error("Error while executing action.", e);
        this.takeScreenshot()
          .then(() => this.emit("done"))
          .catch(() => this.emit("done"));
      });
  }

  instantiateActions(actions) {
    actions.forEach(action => {
      const actionPath = this.availableActions[action.name];
      if (actionPath == null) {
        throw new Error(`Action not found: ${action.name}`);
      }

      action.class = executeActionFile(actionPath);

      let instance = this.actionInstances[action.name];
      if (instance == null) {
        // Instantiate action if it wasn't already instantiated
        instance = instantiateAction(action, this.driver, this.properties);
        this.actionInstances[action.name] = instance;
      }

      action.instance = instance;
      validateActionInstance(action);
    });
  }

  takeScreenshot() {
    return this.driver.takeScreenshot().then((base64Image) => {
      const screenshotFileName = "err.png";
      return new Promise((resolve, reject) => {
        fs.writeFile(screenshotFileName, base64Image, 'base64', function(err) {
          if (err) {
            console.error("Error while saving screenshot", err);
            reject();
          } else {
            console.log(`Screenshot saved at: ${screenshotFileName}`);
            resolve();
          }
        });
      });
    });
  }
}

module.exports = ActionExecutor;
