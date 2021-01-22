import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useLoadVocab, useLoadModel } from './hooks';
import { maxLen, minLen, vocabUrl, modelUrl } from './constants/constants';
import { tokenize, splitText } from './helpers';
import Header from './Header';
import './css/skeleton.css';

function App() {
  const [predictionText, setPredictionText] = useState('');
  const [inputText, setInputText] = useState('');
  const [maxErrorText, setMaxErrorText] = useState('');
  const [resetAll, setResetAll] = useState(true);
  const [visible, setIsVisible] = useState(false);

  const { vocab, vocabLoading, vocabError } = useLoadVocab(vocabUrl);
  const { model, modelLoading, modelError } = useLoadModel(modelUrl);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  }, [visible]);

  const predict = async () => {
    setResetAll(true);
    setMaxErrorText('');
    const { splittedLen } = splitText(inputText);
    if (splittedLen < minLen) {
      setMaxErrorText(`Geben Sie mehr als ${minLen} Wörter!`);
      setPredictionText('');
      setInputText('');
      setIsVisible(true);
      return;
    } else if (splittedLen > maxLen) {
      setMaxErrorText(`Geben Sie weniger als ${maxLen} Wörter!`);
      setPredictionText('');
      setInputText('');
      setIsVisible(true);
    }
    const predictedClass = await tf.tidy(() => {
      const tokenisation = tokenize(inputText, vocabLoading, vocab, maxLen);
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
      } else {
        setPredictionText('News');
      }
      predictedClass.dispose();
    }
  };

  const keyHandler = ({ keyCode }) => {
    if (keyCode === 8) {
      setResetAll(false);
    }

    if (keyCode === 13) {
      predict();
    }
  };

  return (
    <>
      <Header />
      <div>
        <div className="input">
          <h1 className="title">Clickbaits auf 🇩🇪 mit TensorFlow.js</h1>
          <input
            className="form"
            placeholder="Geben Sie hier eine Schlagzeile ein..."
            type="text"
            value={inputText}
            onChange={({ target }) => setInputText(target.value)}
            onKeyDown={(e) => keyHandler(e)}
          />

          <button
            className="form button-primary"
            onClick={() => {
              predict();
            }}
          >
            Vorhersage
          </button>
        </div>
        {predictionText === 'Clickbait' ? (
          <div className="form result red">{resetAll && predictionText}</div>
        ) : (
          <div className="form result green">{resetAll && predictionText}</div>
        )}
        {visible && (
          <div className="form result">
            {<div className="form result">{resetAll && maxErrorText}</div>}
          </div>
        )}
        <div className="form result">{vocabError || modelError}</div>
      </div>
    </>
  );
}

export default App;
