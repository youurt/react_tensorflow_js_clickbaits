import splitText from './splitText';

const tokenize = (text, vocabLoading, vocab, maxLen) => {
  const { splitted } = splitText(text);
  console.log(splitted);
  const tokens = [];

  if (!vocabLoading) {
    splitted.forEach((element) => {
      if (vocab[element] !== undefined) {
        tokens.push(vocab[element]);
      }
    });

    while (tokens.length < maxLen) {
      tokens.push(0);
    }
  }
  return tokens.slice(0, maxLen);
};

export default tokenize;
