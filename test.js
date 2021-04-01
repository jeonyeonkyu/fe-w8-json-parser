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
  const firstToken = tokens[0];
  const nextTokens = tokens.slice(1);
  switch (firstToken.value) {
    case '[':
      return arrayParser(nextTokens);
    case '{':
      return objectParser(nextTokens);
    default:
      return firstToken;
  }
}

function arrayParser(list, idx = 0, parentNode = { type: 'array', child: [] }) {
  let nextIdx;
  for (let i = idx; i < list.length - 1;) {
    switch (list[i].value) {
      case '[':
        const arrayObj = { type: 'array', child: [] };
        nextIdx = arrayParser(list, i + 1, arrayObj);
        parentNode.child.push(arrayObj);
        i = nextIdx;
        break;
      case '{':
        const objectObj = { type: 'object', child: [] };
        nextIdx = objectParser(list, i + 1, objectObj);
        parentNode.child.push(objectObj);
        i = nextIdx;
        break;
      case ',':
        i++;
        break;
      case ']':
        return i + 1;
      default:
        parentNode.child.push(list[i++]);
    }
  }
  return parentNode;
}

function objectParser(list, idx = 0, parentNode = { type: 'object', child: [] }) {
  let j = 0;
  let nextIdx;
  let isKey = true;
  for (let i = idx; i < list.length - 1;) {
    switch (list[i].value) {
      case '[':
        const arrayObj = { type: 'array', child: [] };
        nextIdx = arrayParser(list, i + 1, arrayObj);
        parentNode.child[j++].value.propValue = arrayObj;
        i = nextIdx;
        break;
      case '{':
        const objectObj = { type: 'object', child: [] };
        nextIdx = objectParser();
        parentNode.child[j++].value.propValue = objectObj;
        i = nextIdx;
        break;
      case ':':
        isKey = false;
      case ',':
        i++;
        break;
      case '}':
        return i + 1;
      default:
        if (isKey) {
          parentNode.child[j] = { value: { propKey: list[i++] } };
        } else {
          parentNode.child[j++].value.propValue = list[i++];
          isKey = true;
        }
    }
  }
  return parentNode;
}

const jsonData = '["1a3",[null,false,["1 1",[112233],{"easy" : ["hello", {"a":"a"}, "world"]},112],55, "99"],{"a":"str", "b":[912,[5656,33],{"key" : "innervalue", "newkeys": [1,2,3,4,5]}]}, true]';
// const jsonData = '{"easy" :  ["hello"]}';

const tokens = tokenizer(jsonData);
// console.dir(tokens, { depth: null });

const lexerTokens = lexer(tokens);
// console.dir(lexerTokens, { depth: null });

const parseData = parser(lexerTokens);
console.dir(parseData, { depth: null });