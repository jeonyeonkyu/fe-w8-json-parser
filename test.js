function tokenizer(stringData) {
  const removedEmptySpace = stringData.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g).join('');
  return removedEmptySpace.replace(/(\[)|(\])|({)|(})|(,)|(null)|(false)|(true)|(undefined)|(\d+)|("[0-9a-zA-Z\w\s\[\]}{$]+")|(:)/g, '$&　')
    .slice(0, -1)
    .split('　');
}

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

function parser(tokens) {
  if (!tokens[0]) return tokens;
  let i = 0;
  function arrayParser(parentNode = { type: 'array', child: [] }) {
    while (++i < tokens.length) {
      switch (tokens[i].value) {
        case '[':
          parentNode.child.push(arrayParser());
          break;
        case '{':
          parentNode.child.push(objectParser());
          break;
        case ',':
          break;
        case ']':
          return parentNode;
        default:
          parentNode.child.push(tokens[i]);
      }
    }
    return parentNode;
  }

  function objectParser(parentNode = { type: 'object', child: [] }) {
    let j = 0;
    let isKey = true;
    while (++i < tokens.length) {
      switch (tokens[i].value) {
        case '[':
          parentNode.child[j++].value.propValue = arrayParser();
          break;
        case '{':
          parentNode.child[j++].value.propValue = objectParser();
          break;
        case ',':
          break;
        case '}':
          return parentNode;
        case ':':
          isKey = false;
          break;
        default:
          if (isKey) {
            parentNode.child[j] = { value: { propKey: tokens[i] } };
          } else {
            parentNode.child[j++].value.propValue = tokens[i];
            isKey = true;
          }
      }
    }
    return parentNode;
  }

  switch (tokens[0].value) {
    case '[':
      return arrayParser();
    case '{':
      return objectParser();
    default:
      return tokens[0];
  }
}

const jsonData = '["1a3",[null,false,["1 1",[112233],{"easy" : ["hello", {"a":"a"}, "world"]},112],55, "99"],{"a":"str", "b":[912,[5656,33],{"key" : "innervalue", "newkeys": [1,2,3,4,5]}]}, true]';

const tokens = tokenizer(jsonData);
// console.dir(tokens, { depth: null });

const lexerTokens = lexer(tokens);
// console.dir(lexerTokens, { depth: null });

const parseData = parser(lexerTokens);
console.dir(parseData, { depth: null });