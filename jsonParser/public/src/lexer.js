function lexer(tokens) {
  return tokens.map(convertToMatchType);
}

function getTypeToken(token, type) {
  return { value: token, type: type };
}

function convertToMatchType(token) {
  const giveMeanObject = {
    '[': getTypeToken(token, 'array'),
    ']': getTypeToken(token, 'array'),
    '{': getTypeToken(token, 'object'),
    '}': getTypeToken(token, 'object'),
    ',': getTypeToken(token, 'comma'),
    ':': getTypeToken(token, 'colon'),
    'true': getTypeToken(true, 'boolean'),
    'false': getTypeToken(false, 'boolean'),
    'null': getTypeToken(null, 'object'),
    'undefined': getTypeToken(undefined, 'undefined'),
  }
  if (token[0] === '"' && token[token.length - 1] === '"') {
    return getTypeToken(token.slice(1, -1), 'string');
  } else if (!isNaN(Number(token))) {
    return getTypeToken(Number(token), 'number');
  }
  return giveMeanObject[token];
}

export default lexer;