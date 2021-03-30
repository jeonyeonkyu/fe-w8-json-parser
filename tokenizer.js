
const jsonData = '["1a3",[null,false,["1 1",[112233],{"easy" : ["hello", {"a":"a"}, "world"]},112],55, "99"],{"a":"str", "b":[912,[5656,33],{"key" : "innervalue", "newkeys": [1,2,3,4,5]}]}, true]';


function tokenizer(stringData) {
  const removedEmptySpace = stringData.match(/[^\s"']+|"([^"]*)"|'([^']*)'/gm).join('');
  return removedEmptySpace.replace(/(\[)|(\])|({)|(})|(,)|(null)|(false)|(true)|(undefined)|(\d+)|("[0-9a-zA-Z\w\s\[\]}{$]+")|(:)/gm, '$&꽓')
    .slice(0, -1)
    .split('꽓');
}

function lexer(tokens) {
  return tokens.map((token) => { return { type: getTypeToken(token), value: token } });
}

function getTypeToken(token) {
  const giveMeanObject = {
    '[': 'array',
    ']': 'array',
    '{': 'object',
    '}': 'object',
    'true': 'boolean',
    'false': 'boolean',
    'null': 'null',
    ',': 'comma',
    ':': 'colon',
  }
  if (token[0] === '"' && token[token.length - 1] === '"') {
    return 'string';
  } else if (!isNaN(Number(token))) {
    return 'number';
  }
  return giveMeanObject[token];
}


// function parser(tokens) {
//   let i = -1;
//   function oneTokenParse(array = [], object = {}) {

//     while (i < tokens.length) {
//       ++i;
//       if (token[i] === '[') {
//         return {
//           type: tokens.type,
//           child: oneTokenParse(),
//         }
//       } else if (token[i] === ']') {
//         return;
//       }

//     }
//   }

//   return oneTokenParse();
// }

console.log(lexer(tokenizer(jsonData)))