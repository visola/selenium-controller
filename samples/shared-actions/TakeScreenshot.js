const fs = require('fs');

class TakeScreenshot {
  constructor(driver) {
    this.driver = driver;
  }

  execute(filename = `${Date.now()}.png`) {
    return this.driver.takeScreenshot().then((base64Image) => {
      return new Promise((resolve, reject) => {
        fs.writeFile(filename, base64Image, 'base64', function(err) {
          if (err) {
            console.error("Error while saving screenshot", err);
            reject();
          } else {
            console.log(`Screenshot saved at: ${filename}`);
            resolve();
          }
        });
      });
    });
  }
}

module.exports = TakeScreenshot
