const fs = require('fs');
const yaml = require('js-yaml');

class Properties {
  constructor() {
    this.properties = {};
  }

  addAll(properties) {
    for (let name in properties) {
      this.properties[name] = properties[name];
    }
  }

  addFromFile(file) {
    this.addAll(yaml.safeLoad(fs.readFileSync(file), "utf-8"));
  }

  get(name) {
    return this.properties[name];
  }

  getAll() {
    return Object.assign({}, this.properties);
  }

  set(name, value) {
    this.properties[name] = value;
  }
}

module.exports = Properties;
