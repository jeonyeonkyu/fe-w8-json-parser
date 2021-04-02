function lexicalize(tokens) {
  return tokens.map(convertToMatchType);
}

function getLexicalizedObject(token, type) {
  return { value: token, type: type };
}

function convertToMatchType(token) {
  const matchedTypeObject = {
    '[': getLexicalizedObject(token, 'array'),
    ']': getLexicalizedObject(token, 'array'),
    '{': getLexicalizedObject(token, 'object'),
    '}': getLexicalizedObject(token, 'object'),
    ',': getLexicalizedObject(token, 'comma'),
    ':': getLexicalizedObject(token, 'colon'),
    'true': getLexicalizedObject(true, 'boolean'),
    'false': getLexicalizedObject(false, 'boolean'),
    'null': getLexicalizedObject(null, 'object'),
    'undefined': getLexicalizedObject(undefined, 'undefined'),
  }
  if (token[0] === '"' && token[token.length - 1] === '"') {
    return getLexicalizedObject(token.slice(1, -1), 'string');
  } else if (!isNaN(Number(token))) {
    return getLexicalizedObject(Number(token), 'number');
  }
  return matchedTypeObject[token];
}

export default lexicalize;