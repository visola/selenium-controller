class FailToInstantiate {
  constructor() {
    throw new Error('This will blow up!');
  }
}

module.exports = FailToInstantiate;
