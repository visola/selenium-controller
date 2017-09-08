const { expect } = require('chai');
const Properties = require('../lib/Properties');

describe('Properties', () => {
  let properties;

  beforeEach(() => {
    properties = new Properties();
  });

  describe('#addAll', () => {

  });

  describe('#addFromFile', () => {
    it('should load file and set properties', () => {
      properties.addFromFile(`${__dirname}/fixtures/properties.yml`);
      expect(properties.get('something')).to.equal('value');
    });
  });

  describe('#get', () => {
    it('should not find a property that was not set', () => {
      expect(properties.get('something')).to.be.undefined;
    });

    it('should find a property that was set', () => {
      const key = 'something';
      const value = 'value';
      properties.set(key, value);
      expect(properties.get(key)).to.equal(value);
    });
  });
});
