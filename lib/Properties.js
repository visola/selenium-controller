const fs = require('fs');
const yaml = require('js-yaml');

class Properties {
  constructor() {
    this.properties = {};
  }

  addAll(properties) {
    Object.keys(properties).forEach(key => this.properties[key] = properties[key]);
  }

  addFromFile(file) {
    this.addAll(yaml.safeLoad(fs.readFileSync(file), 'utf-8'));
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
