const { expect } = require('chai');
const { beforeEach, describe, it } = require('mocha');
const Properties = require('../../lib/Properties');

describe('Properties', () => {
  let properties;

  beforeEach(() => {
    properties = new Properties();
  });

  describe('#addAll', () => {
    it('should add all properties from an object', () => {
      const someObject = { another: 'value1', something: 'value2' };
      properties.addAll(someObject);
      Object.keys(someObject).forEach(key => expect(properties.get(key)).to.equal(someObject[key]));
    });
  });

  describe('#addFromFile', () => {
    it('should load file and set properties', () => {
      properties.addFromFile(`${__dirname}/../fixtures/lib/Properties/properties.yml`);
      expect(properties.get('something')).to.equal('value');
    });
  });

  describe('#get', () => {
    it('should not find a property that was not set', () => {
      // https://github.com/chaijs/chai/issues/41
      expect(properties.get('something')).to.be.equal(undefined);
    });

    it('should find a property that was set', () => {
      const key = 'something';
      const value = 'value';
      properties.set(key, value);
      expect(properties.get(key)).to.equal(value);
    });
  });

  describe('#getAll', () => {
    it('should return an object with all properties', () => {
      const someObject = { another: 'value1', something: 'value2' };
      properties.addAll(someObject);

      const returnedProperties = properties.getAll();
      expect(returnedProperties).to.deep.equal(someObject);
    });

    it('should not mutate through the object returned from getAll', () => {
      const someObject = { another: 'value1', something: 'value2' };
      properties.addAll(someObject);

      const changedKey = 'another';
      const returnedProperties = properties.getAll();
      returnedProperties[changedKey] = 'somethingElse';

      // All properties should still be the same
      expect(properties.getAll()).to.deep.equal(someObject);
    });
  });
});
