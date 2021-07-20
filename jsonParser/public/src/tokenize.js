function tokenize(stringData) {
  const tokenizedData = stringData
    .replace(/\/\*.*?\*\//g, '')
    .match(
      /\[|\]|\(|\)|\{|\}|".*?"|[+-]?([0-9]*[.])?[0-9]+|true|false|null|undefined|:|,/gi
    );
  return tokenizedData;
}

export default tokenize;