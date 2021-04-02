const rawData = '{ "a": "str", "b": [912, [5656, 33]] }';
// '["1a3",[null,false,["11",[112233],55],{"key" : "innervalue"}], true]'
// '["1a3",[null,false,["11",[112233],{"easy" : ["hello", {"a":"a"}, "world"]},112],55, "99"],{"a":"str", "b":[912,[5656,33],{"key" : "innervalue", "newkeys": [1,2,3,4,5]}]}, true]';

const tokenize = (data) => {
  const tokenizedData = data
    .replace(/\/\*.*?\*\//g, '')
    .match(
      /\[|\]|\(|\)|\{|\}|".*?"|[+-]?([0-9]*[.])?[0-9]+|true|false|null|undefined|:/gi
    );
  return tokenizedData;
};

const regexType = new Map([
  ['openObjSeparator', /[{]/],
  ['closeObjSeparator', /[}]/],
  ['openArrSeparator', /[\[]/],
  ['closeArrSeparator', /[\]]/],
  ['string', /^".*?"$/],
  ['number', /^-?([0-9]*[.])?[0-9]+$/],
  ['boolean', /true|false/i],
  ['null', /null/i],
  ['colon', /:/],
  ['undefined', /undefined/i],
]);

const lexicalize = (tokens) => {
  return tokens.reduce((acc, token) => {
    for (const [dataType, regex] of regexType) {
      if (regex.test(token)) {
        acc.push({ type: dataType, value: token });
        return acc;
      }
    }
  }, []);
};

const makeStructure = (dataType) => {
  return {
    type: dataType,
    child:
      dataType === 'object'
        ? [
            {
              value: {},
              type: 'objectProperty',
            },
          ]
        : [],
  };
};

const finishTree = (treeStack) => {
  if (treeStack.length === 1) return treeStack[0];

  if (treeStack.length > 1) {
    const completedItem = treeStack.pop();
    treeStack.slice(-1)[0].child.push(completedItem);
  }

  if (treeStack.slice(-1)[0].isPropValue) {
    delete treeStack.slice(-1)[0].isPropValue;
    treeStack.slice(-2)[0].child[0].value.propValue = treeStack.pop().child[0];
  }
};

const parse = (tokens) => {
  const treeStack = [];
  let propValueNum = 0;
  let i = -1;
  let isKey = true;
  function makeTree() {
    while (i++ < tokens.length - 1) {
      const token = tokens[i];
      switch (token.type) {
        case 'openObjSeparator':
          if (!isKey) {
            isKey = true;
            treeStack.push({
              type: 'object',
              child: [
                {
                  value: {},
                  type: 'objectProperty',
                },
              ],
              isPropValue: true,
            });
            // break;
          }
          treeStack.push(makeStructure('object'));
          break;

        case 'closeObjSeparator':
          finishTree(treeStack);
          break;

        case 'openArrSeparator':
          if (!isKey) {
            isKey = true;
            treeStack.push({
              type: 'array',
              child: [],
              isPropValue: true,
            });
            // break;
          }
          treeStack.push(makeStructure('array'));
          break;

        case 'closeArrSeparator':
          finishTree(treeStack);
          break;

        case 'colon':
          isKey = false;
          break;

        default:
          const lastItem = treeStack.slice(-1)[0];

          if (lastItem.type === 'object' && isKey) {
            if (lastItem.child.value) {
              lastItem.child.push({
                value: {},
                type: 'objectProperty',
              });
              debugger;
            }
            lastItem.child[lastItem.child.length - 1].value.propKey = {
              type: token.type,
              value: token.value,
            };
          } else if (lastItem.type === 'object' && !isKey) {
            lastItem.child[lastItem.child.length - 1].value.propValue = {
              type: token.type,
              value: token.value,
            };
            isKey = true;
          } else if (lastItem.type === 'array') {
            lastItem.child.push({
              type: token.type,
              value: token.value,
            });
          }
      }
    }
    return treeStack[0];
  }
  return makeTree();
};

const tokens = tokenize(rawData);
const lexerTokens = lexicalize(tokens);
const parseTree = parse(lexerTokens);
console.dir(parseTree, { depth: null });
