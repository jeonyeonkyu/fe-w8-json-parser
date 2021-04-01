// function parser(tokens) {
//   let i = 0;
//   function arrayParser(parentNode = { type: 'array', child: [] }) {
//     while (++i < tokens.length) {
//       switch (tokens[i].value) {
//         case '[':
//           parentNode.child.push(arrayParser());
//           break;
//         case '{':
//           parentNode.child.push(objectParser());
//           break;
//         case ',':
//           break;
//         case ']':
//           return parentNode;
//         default:
//           parentNode.child.push(tokens[i]);
//       }
//     }
//     return parentNode;
//   }

//   function objectParser(parentNode = { type: 'object', child: [] }) {
//     let j = 0;
//     let isKey = true;
//     while (++i < tokens.length) {
//       switch (tokens[i].value) {
//         case '[':
//           parentNode.child[j].value.propValue = arrayParser();
//           break;
//         case '{':
//           parentNode.child[j].value.propValue = objectParser();
//           break;
//         case ',':
//           break;
//         case '}':
//           return parentNode;
//         case ':':
//           isKey = false;
//           break;
//         default:
//           if (isKey) {
//             parentNode.child[j] = { value: { propKey: tokens[i] } };
//           } else {
//             parentNode.child[j++].value.propValue = tokens[i];
//             isKey = true;
//           }
//       }
//     }
//     return parentNode;
//   }

//   switch (tokens[0].value) {
//     case '[':
//       return arrayParser();
//     case '{':
//       return objectParser();
//     default:
//       return tokens[0];
//   }
// }


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


export default parser;