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

  function objectParser() {
    let j = 0;
    let isKey = true;
    const parentNode = { type: 'object', child: [] };
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

export default parser;