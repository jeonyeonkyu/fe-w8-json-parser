function parse(tokens) {
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

function makeStructure(dataType) {
  return { type: dataType, child: [] };
}

function arrayParser(list, idx = 0, parentNode = makeStructure('array')) {
  let nextIdx;
  for (let i = idx; i < list.length - 1;) {
    switch (list[i].value) {
      case '[':
        const arrayObj = makeStructure('array');
        nextIdx = arrayParser(list, i + 1, arrayObj);
        parentNode.child.push(arrayObj);
        i = nextIdx;
        break;
      case '{':
        const objectObj = makeStructure('object');
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

function objectParser(list, idx = 0, parentNode = makeStructure('object')) {
  let j = -1;
  let nextIdx;
  let isKey = true;
  for (let i = idx; i < list.length - 1;) {
    switch (list[i].value) {
      case '[':
        const arrayObj = makeStructure('array');
        nextIdx = arrayParser(list, i + 1, arrayObj);
        parentNode.child[j].value.propValue = arrayObj;
        i = nextIdx;
        break;
      case '{':
        const objectObj = makeStructure('object');
        nextIdx = objectParser(list, i + 1, objectObj);
        parentNode.child[j].value.propValue = objectObj;
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
          parentNode.child[++j] = { value: { propKey: list[i++] } };
        } else {
          parentNode.child[j].value.propValue = list[i++];
          isKey = true;
        }
    }
  }
  return parentNode;
}

export default parse;