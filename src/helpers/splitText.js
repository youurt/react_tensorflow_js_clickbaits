const tokenizer = require('wink-tokenizer');
const myTokenizer = tokenizer();

const splitText = (sentence) => {
  const tokens = myTokenizer.tokenize(sentence);
  const splitted = [];
  tokens.forEach((token) => {
    if (token.tag === 'number') {
      splitted.push(token.value);
    } else if (token.tag === 'word') {
      if (token.value.length >= 1) {
        splitted.push(token.value.toLowerCase());
      }
    } else if (token.tag === 'punctuation') {
      if (token.value === '?' || token.value === '!') {
        splitted.push(token.value);
      }
    }
  });

  return { splitted: splitted, splittedLen: splitted.length };
};

export default splitText;
