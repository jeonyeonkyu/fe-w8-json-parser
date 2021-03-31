
import '../scss/main.scss';
import '../scss/util.scss';
import tokenizer from './tokenizer.js';
import lexer from './lexer.js';
import parser from './parser.js';

function load() {
  const el = {
    $button: document.querySelector('._button'),
    $textarea: document.querySelector('._input_text'),
    $printBox: document.querySelector('._print_box')
  }

  function parseClickHandler() {
    const tokens = tokenizer(el.$textarea.value);
    const lexerTokens = lexer(tokens);
    const parseData = parser(lexerTokens);
    el.$printBox.innerText = JSON.stringify(parseData, null, ' ');
  }

  el.$button.addEventListener('click', parseClickHandler);
}

window.addEventListener('DOMContentLoaded', load);