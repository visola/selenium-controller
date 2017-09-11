class ActionThatFails {
  execute() {
    return Promise.reject(new Error('This will fail.'));
  }
}

module.exports = ActionThatFails;
