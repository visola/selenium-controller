class ActionThatThrows {
  execute() {
    throw new Error('This action fails to return a promise.');
  }
}

module.exports = ActionThatThrows;
