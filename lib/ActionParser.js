const esprima = require('esprima');

const TYPE_ARRAY_EXPRESSION = 'ArrayExpression';
const TYPE_CALL_EXPRESSION = 'CallExpression';
const TYPE_IDENTIFIER = 'Identifier';
const TYPE_LITERAL = 'Literal';

function actionFromCallExpression(expression, properties) {
  return {
    arguments: parseArguments(expression.arguments, properties),
    name: expression.callee.name,
  };
}

function actionFromIdentifier(expression) {
  return {
    arguments: [],
    name: expression.name,
  };
}

function parseArguments(args, properties) {
  const result = [];
  args.forEach((argument) => {
    switch (argument.type) {
      case TYPE_LITERAL:
        result.push(argument.value);
        break;
      case TYPE_ARRAY_EXPRESSION:
        result.push(parseArguments(argument.elements, properties));
        break;
      case TYPE_IDENTIFIER:
        result.push(parseIdentifierArgument(properties, argument));
        break;
      default:
        throw new Error(`Unsupported type for argument: ${JSON.stringify(argument)}`);
    }
  });
  return result;
}

function parseIdentifierArgument(properties, argument) {
  const value = properties[argument.name];
  if (value === undefined) {
    throw new Error(`Expected property '${argument.name}' but it wasn't set.`);
  }
  return value;
}

function parseJavascript(code) {
  try {
    return esprima.parseScript(code);
  } catch (parseError) {
    let message = `while parsing expression: ${parseError.description}\n${code}`;

    if (parseError.index >= 0) {
      // Mark where the parse error happened
      message += `\n${' '.repeat(parseError.index)}^`;
    }

    throw new Error(message);
  }
}

class ActionParser {
  constructor(properties) {
    this.properties = properties;
  }

  parse(expression) {
    const parsedExpression = parseJavascript(expression);
    const body = parsedExpression.body[0];

    const executeExpression = body.expression;
    try {
      switch (executeExpression.type) {
        case TYPE_IDENTIFIER:
          return actionFromIdentifier(executeExpression);
        case TYPE_CALL_EXPRESSION:
          return actionFromCallExpression(executeExpression, this.properties);
        default:
          throw new Error(`Unexpected type: ${executeExpression.type}`);
      }
    } catch (e) {
      throw new Error(`Error while parsing expression: '${expression}'\n${e}`);
    }
  }
}

module.exports = ActionParser;
