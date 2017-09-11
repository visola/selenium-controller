const { expect } = require('chai');
const { mock } = require('sinon');

const ActionExecutor = require('../../lib/ActionExecutor');

const ACTIONS_FOLDERS = [`${__dirname}/../fixtures/lib/ActionExecutor/actions`];

describe('ActionExecutor', () => {

  describe('#executeAll', () => {
    const driver = {};
    const properties = {};
    const actionExecutor = new ActionExecutor(ACTIONS_FOLDERS, driver, properties);

    const toExecute = [
      {name: "Sample"}
    ];

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
  });

});
