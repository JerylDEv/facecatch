import React, { useState } from 'react';
import './App.css';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Navigation from '../components/Navigation/Navigation';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import Rank from '../components/Rank/Rank';
import SignIn from '../components/SignIn/SignIn';
import Register from '../components/Register/Register';
import Particles from 'react-particles-js';

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
      setInput('');
      setImageUrl('');
      setFaceBoxes([]);
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
    setFaceBoxes([]);
    fetch('https://arcane-mesa-01478.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: input }),
    })
      .then((response) => response.json())
      .then((response) => {
        fetch('https://arcane-mesa-01478.herokuapp.com/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userProfile.id }),
        })
          .then((response) => response.json())
          .then((count) => {
            setFaceBoxes(calculateFaceLocation(response));
            setUserProfile({ ...userProfile, entries: count });
          });
      })
      .catch((err) => console.log('error:::', err));
  };

  const loadUser = (data) => {
    setUserProfile({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  return (
    <div className='App'>
      <Particles className='particles' params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home' ? (
        <div>
          <Rank name={userProfile.name} entries={userProfile.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onPictureSubmit={onPictureSubmit}
          />
          <FaceRecognition faceBoxes={faceBoxes} imageUrl={imageUrl} />
        </div>
      ) : route === 'signin' ? (
        <SignIn onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );
}

export default App;
