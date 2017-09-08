const { By, until } = require('selenium-webdriver');

class GoToReactToDo {
  constructor(driver, properties) {
    this.driver = driver;
    this.timeout = properties.timeout;
    this.url = properties.url;
  }

  execute() {
    const { driver, timeout, url } = this;

    return driver
      .get(url)
      .then(() => driver.wait(until.elementLocated(By.xpath("//h1[contains(text(),'todos')]")), timeout));
  }
}

module.exports = GoToReactToDo;
