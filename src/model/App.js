import { useState, useEffect } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
const maxLen = 75;
const minLen = 10;

function App() {
  const [model, setModel] = useState();
  const [vocab, setVocab] = useState();
  const [predictionText, setPredictionText] = useState('');
  const [vocabLoading, setVocabLoading] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [maxErrorText, setMaxErrorText] = useState('');
  const [resetAll, setResetAll] = useState(true);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    loadVocab();
  }, []);

  useEffect(() => {
    const modelUrl =
      'https://clickbaitsdetection.s3.eu-central-1.amazonaws.com/model/model.json';

    tf.ready().then(() => {
      loadModel(modelUrl);
    });
  }, []);

  const loadModel = async (url) => {
    try {
      const model = await tf.loadLayersModel(url);
      setModel(model);
      setModelLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const loadVocab = async () => {
    try {
      const response = await fetch(
        'https://clickbaitsdetection.s3.eu-central-1.amazonaws.com/model/vocab.json'
      );
      const data = await response.json();
      setVocab(data);
      setVocabLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const tokenize = (text) => {
    const splittedText = text.toLowerCase().split(/([_\W])/);
    const tokens = [];

    if (!vocabLoading) {
      splittedText.forEach((element) => {
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

  const predict = async () => {
    setResetAll(true);
    setMaxErrorText('');
    if (inputText.length < minLen) {
      setMaxErrorText(`should be more than ${minLen}`);
      setPredictionText('');
      setInputText('');
      return;
    }
    const predictedClass = await tf.tidy(() => {
      // const text = 'In Deutschland herrscht ab Januar Fahrverbot!';
      const tokenisation = tokenize(inputText);
      if (tokenisation.length > 0) {
        const input = tf.tensor2d(tokenisation, [1, maxLen]);
        if (!modelLoading) {
          const predictions = model.predict(input);
          return predictions.as1D().argMax();
        }
      }
    });

    if (predictedClass !== undefined) {
      const classId = (await predictedClass.data())[0];

      if (classId === 0) {
        setPredictionText('Clickbait');
        setShowResult(true);
      } else {
        setPredictionText('News');
        setShowResult(true);
      }
      predictedClass.dispose();
    }
  };

  const keyHandler = ({ keyCode }) => {
    if (keyCode === 8) {
      setResetAll(false);
      setShowResult(false);
    }

    if (keyCode === 13) {
      predict();
    }
  };

  return (
    <div>
      <input
        type="text"
        maxLength={maxLen}
        onInput={({ target }) =>
          target.value.length === maxLen
            ? setMaxErrorText(`should be less then ${target.maxLength}`)
            : null
        }
        value={inputText}
        onChange={({ target }) => setInputText(target.value)}
        onKeyDown={(e) => keyHandler(e)}
      />

      <button
        onClick={() => {
          predict();
        }}
      >
        press
      </button>
      <div>{resetAll && predictionText}</div>
      <div>{resetAll && maxErrorText}</div>
      <div>{showResult && inputText}</div>
      <div>{error}</div>
    </div>
  );
}

export default App;
