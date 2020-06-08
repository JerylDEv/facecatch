import React, { useState } from 'react';
import './App.css';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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
  const [imageUrl, setImageUrl] = useState('');
  const [faceBoxes, setFaceBoxes] = useState([]);
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  });

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  const calculateFaceLocation = (data) => {
    let faceArray = data.outputs[0].data.regions.map(
      (item) => item.region_info.bounding_box
    );

    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);
    // console.log(faceArray);
    return faceArray.map((face) => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - face.right_col * width,
        bottomRow: height - face.bottom_row * height,
      };
    });
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onPictureSubmit = () => {
    setImageUrl(input);
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, input)
      .then((response) => {
        fetch('http://localhost:4000/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userProfile.id }),
        })
          .then((response) => response.json())
          .then((count) => setUserProfile({ ...userProfile, entries: count }));
        return setFaceBoxes(calculateFaceLocation(response));
      })
      .catch((err) => console.log('error:::', err));
  };
  // console.log('FaceBoxes::', faceBoxes);

  const loadUser = (data) => {
    setUserProfile({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };
  console.log('userProfile::', userProfile);

  return (
    <div className='App'>
      <Particles className='particles' params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home' ? (
        <div>
          <Logo />
          <Rank name={userProfile.name} entries={userProfile.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onPictureSubmit={onPictureSubmit}
          />
          <FaceRecognition faceBoxes={faceBoxes} imageUrl={imageUrl} />
        </div>
      ) : route === 'signin' ? (
        <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );
}

export default App;
