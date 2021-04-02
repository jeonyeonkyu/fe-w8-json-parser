
import '../scss/main.scss';
import '../scss/util.scss';
import tokenize from './tokenize.js';
import lexicalize from './lexicalize.js';
import parse from './parse.js';

function load() {
  const el = {
    $button: document.querySelector('._button'),
    $textarea: document.querySelector('._input_text'),
    $printBox: document.querySelector('._print_box')
  }

  function parseClickHandler() {
    const tokens = tokenize(el.$textarea.value);
    const lexerTokens = lexicalize(tokens);
    const parseData = parse(lexerTokens);
    el.$printBox.innerText = JSON.stringify(parseData, null, ' ');
  }

  el.$button.addEventListener('click', parseClickHandler);
}

window.addEventListener('DOMContentLoaded', load);