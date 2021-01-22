import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const useLoadModel = (url) => {
  const [model, setModel] = useState();
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState('');
  const loadModel = async (url) => {
    try {
      const model = await tf.loadLayersModel(url);
      setModel(model);
      setModelLoading(false);
    } catch (error) {
      setModelError(error);
      console.log(error);
    }
  };

  useEffect(() => {
    tf.ready().then(() => {
      loadModel(url);
    });
  }, [url]);

  return {
    model,
    setModel,
    modelLoading,
    setModelLoading,
    modelError,
    setModelError,
  };
};

export default useLoadModel;
