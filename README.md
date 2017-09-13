## Selenium Controller [![Build Status](https://travis-ci.org/visola/selenium-controller.svg?branch=master)](https://travis-ci.org/visola/selenium-controller) [![codecov](https://codecov.io/gh/visola/selenium-controller/branch/master/graph/badge.svg)](https://codecov.io/gh/visola/selenium-controller)[![Codacy Badge](https://api.codacy.com/project/badge/Grade/691d1d2346e34b0988af8a260b51cd87)](https://www.codacy.com/app/visola/selenium-controller?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=visola/selenium-controller&amp;utm_campaign=Badge_Grade)

Selenium controller is a Node.js application that can be used to test web applications or execute repetitive tasks using Javascript code and [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver).

### Installation

Before anything make sure [Chrome webdriver](https://sites.google.com/a/chromium.org/chromedriver/) is installed and setup correctly.

Clone the repo and run npm install:

```bash
$ git clone https://github.com/visola/selenium-controller.git
$ cd selenium-controller/
$ npm install
```

Starting using it!

### Long Description

The idea is that you have folders with Node modules that export Action classes. Each action executes some specific task. It might receive some arguments and or depend on some properties. You pass the actions you want to execute to the command either by arguments through the command line or via a script file, line-by-line.

An example would be something like:

```bash
$ node index \
  -a samples/react-to-do/actions \
  -a samples/shared-actions \
  -f samples/react-to-do/properties.yml \
  -e GoToReactToDo \
  -e "TakeScreenshot('home.png')" \
  -e "CreateToDo('Buy Milk')" \
  -e "TakeScreenshot('buy-milk.png')"
```

This command is doing the following:

- `-a samples/react-to-do/actions` and `-a samples/shared-actions` - Load action classes from these directories
- `-f react-to-do/properties.yml` - Read environment properties from this file
- `-e GoToReactToDo`, `-e "TakeScreenshot('home.png')"` ... - Execute these actions

This command would output the following:

```
Properties are: {"timeout":10000,"url":"http://todomvc.com/examples/react"}
Mapping action file: CreateToDo -> /Users/visola/git/selenium-controller/samples/react-to-do/actions/CreateToDo.js
Mapping action file: GoToReactToDo -> /Users/visola/git/selenium-controller/samples/react-to-do/actions/GoToReactToDo.js
Mapping action file: TakeScreenshot -> /Users/visola/git/selenium-controller/samples/shared-actions/TakeScreenshot.js
Executing the following actions: GoToReactToDo, TakeScreenshot, CreateToDo, TakeScreenshot
Executing action: 'GoToReactToDo' with arguments: []
Executed 'GoToReactToDo' in 1392 ms
Executing action: 'TakeScreenshot' with arguments: ["home.png"]
Screenshot saved at: home.png
Executed 'TakeScreenshot' in 409 ms
Executing action: 'CreateToDo' with arguments: ["Buy Milk"]
Executed 'CreateToDo' in 162 ms
Executing action: 'TakeScreenshot' with arguments: ["buy-milk.png"]
Screenshot saved at: buy-milk.png
Executed 'TakeScreenshot' in 307 ms
Finished executing all actions in 2275 ms
```

## Samples

### react-to-do

Some sample actions that uses [React To Do](http://todomvc.com/examples/react) as an example. There's also a sample script that executes the same actions as the sample command in the long description. You could achieve the same results using the following command:

```bash
node index \
  -a samples/react-to-do/actions \
  -a samples/shared-actions \
  -f samples/react-to-do/properties.yml \
  -s ./samples/react-to-do/script.js
```
