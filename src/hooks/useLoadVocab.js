import { useState, useEffect } from 'react';

const useLoadVocab = (url) => {
  const [vocab, setVocab] = useState();
  const [vocabLoading, setVocabLoading] = useState(true);
  const [vocabError, setVocabError] = useState('');

  useEffect(() => {
    const loadVocab = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setVocab(data);
        setVocabLoading(false);
      } catch (error) {
        setVocabError(error);
        console.log(error);
      }
    };
    loadVocab(url);
  }, [url]);

  return {
    vocab,
    setVocab,
    vocabLoading,
    setVocabLoading,
    vocabError,
    setVocabError,
  };
};

export default useLoadVocab;
