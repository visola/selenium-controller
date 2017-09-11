const { beforeEach, describe, it } = require('mocha');
const { expect } = require('chai');
const ActionParser = require('../../lib/ActionParser');

describe('ActionParser', () => {
  let actionParser;
  let properties;

  beforeEach(() => {
    properties = {
      anotherKey: 'anotherValue',
      someKey: 'someValue',
    };

    actionParser = new ActionParser(properties);
  });

  describe('#parse', () => {
    function createExpected(actionName, args) {
      return {
        name: actionName,
        arguments: args || [],
      };
    }

    it('should parse an action name', () => {
      const actionName = 'ActionName';
      const result = actionParser.parse(actionName);
      expect(result).to.deep.equal(createExpected(actionName));
    });

    it('throws if invalid expression', () => {
      expect(() => actionParser.parse('!@#$ What is this $#@!')).to.throw();
    });

    describe('calling actions with arguments', () => {
      it('should parse an action call with literals', () => {
        const actionName = 'ActionName';
        const value = 'someValue';
        const expression = `${actionName}('${value}')`;
        const result = actionParser.parse(expression);
        expect(result).to.deep.equal(createExpected(actionName, [value]));
      });

      it('should parse an action call with arrays', () => {
        const actionName = 'ActionName';
        const values = '[10, 20]';
        const expression = `${actionName}(${values})`;
        const result = actionParser.parse(expression);
        expect(result).to.deep.equal(createExpected(actionName, [JSON.parse(values)]));
      });

      describe('using arguments from properties', () => {
        it('parses properly if the property name exists', () => {
          const actionName = 'ActionName';
          const expression = `${actionName}(someKey)`;
          const result = actionParser.parse(expression);
          expect(result).to.deep.equal(createExpected(actionName, [properties.someKey]));
        });

        it('parses properly if array of valid property names', () => {
          const actionName = 'ActionName';
          const expression = `${actionName}([anotherKey, someKey])`;
          const result = actionParser.parse(expression);
          expect(result.name).to.equal(actionName);
          expect(result.arguments[0]).to.have.members([properties.anotherKey, properties.someKey]);
        });

        it('throws if property name does not exist', () => {
          const actionName = 'ActionName';
          const expression = `${actionName}(notARealName)`;
          expect(() => actionParser.parse(expression)).to.throw();
        });
      });
    });
  });
});
