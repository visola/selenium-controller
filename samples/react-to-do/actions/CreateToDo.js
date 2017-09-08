const { By, Key } = require('selenium-webdriver');

class CreateToDo {
  constructor(driver) {
    this.driver = driver;
  }

  execute(text) {
    return this.driver
      .findElement(By.css('input.new-todo'))
      .sendKeys(text + Key.ENTER);
  }
}

module.exports = CreateToDo;
