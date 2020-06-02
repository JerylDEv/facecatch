import React, { useState } from 'react';
import './App.css';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
// import Clarifai from 'clarifai';
const Clarifai = require('clarifai');

const app = new Clarifai.App({ apiKey: process.env.REACT_APP_FACECATCH_KEY });

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: { enable: true, value_area: 800 },
    },
  },
};

function App() {
  const [input, setInput] = useState('');

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
    app.models
      .predict(
        'a403429f2ddf4b49b307e318f00e528b',
        input || 'https://samples.clarifai.com/face-det.jpg'
      )
      .then(
        function (response) {
          // do something with response
          console.log('response:::', response);
        },
        function (err) {
          // there was an error
          console.log('error', err);
        }
      );
  };

  return (
    <div className='App'>
      <Particles className='particles' params={particlesOptions} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
      <FaceRecognition inputImage={input} />
    </div>
  );
}

export default App;
