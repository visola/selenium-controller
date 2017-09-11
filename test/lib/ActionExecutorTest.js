const { beforeEach, describe, it } = require('mocha');
const { expect } = require('chai');
const { mock } = require('sinon');

const ActionExecutor = require('../../lib/ActionExecutor');

const ACTIONS_FOLDERS = [`${__dirname}/../fixtures/lib/ActionExecutor/actions`];

describe('ActionExecutor', () => {
  class Driver {
    constructor() {
      this.screenshotCount = 0;
    }
    takeScreenshot() {
      this.screenshotCount += 1;
      return Promise.resolve();
    }
  }

  let driver;
  const properties = {};

  beforeEach(() => {
    driver = new Driver();
  });

  describe('#constructor', () => {
    it('does not blow up if actions folder is not real', () => {
      const actionFolders = ['/this/directory/does/not/exist'];
      /* eslint-disable no-new */
      new ActionExecutor(actionFolders, driver, properties);
      /* eslint-enable no-new */
    });

    it('does not blow up if two actions with same name', () => {
      const actionFolders = [
        `${__dirname}/../fixtures/lib/ActionExecutor/actions`,
        `${__dirname}/../fixtures/lib/ActionExecutor/more-actions`,
      ];
      /* eslint-disable no-new */
      new ActionExecutor(actionFolders, driver, properties);
      /* eslint-enable no-new */
    });
  });

  describe('#executeAll', () => {
    let actionExecutor;
    let toExecute;

    beforeEach(() => {
      actionExecutor = new ActionExecutor(ACTIONS_FOLDERS, driver, properties);

      toExecute = [{ name: 'Sample' }];
    });

    it('should not blow up', () => {
      actionExecutor.executeAll(toExecute);
    });

    it('calls done callback when it is done', () => {
      const callback = mock();
      callback.once();

      actionExecutor.on('done', callback);
      actionExecutor.executeAll(toExecute)
        .then(() => callback.verify());
    });

    it('takes a screenshot if an action fails', (done) => {
      function checkAndFail() {
        try {
          expect(driver.screenshotCount).to.equal(1);
          done();
        } catch (e) {
          done(e);
        }
      }

      toExecute = [{ name: 'ActionThatFails' }];
      actionExecutor.executeAll(toExecute)
        .then(checkAndFail)
        .catch(checkAndFail);
    });

    it('throws if class is not a valid action', () => {
      toExecute = [{ name: 'NotAnAction' }];
      expect(() => actionExecutor.executeAll(toExecute)).to.throw();
    });

    it('throws if action is not found', () => {
      toExecute = [{ name: 'DoesNotExist' }];
      expect(() => actionExecutor.executeAll(toExecute)).to.throw();
    });

    it('throws if error while instantiating action class', () => {
      toExecute = [{ name: 'FailToInstantiate' }];
      expect(() => actionExecutor.executeAll(toExecute)).to.throw();
    });
  });
});
