

function tokenizer(stringData) {
  const removedEmptySpace = stringData.match(/[^\s"']+|"([^"]*)"|'([^']*)'/gm).join('');
  return removedEmptySpace.replace(/(\[)|(\])|({)|(})|(,)|(null)|(false)|(true)|(undefined)|(\d+)|("[0-9a-zA-Z\w\s\[\]}{$]+")|(:)/gm, '$&　')
    .slice(0, -1)
    .split('　');
}

export default tokenizer;