import React from 'react';
import 'tachyons';
import Logo from '../Logo/Logo';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav
        class='dt w-100 border-box pa3 ph5-ns'
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Logo />
        <p
          onClick={() => onRouteChange('signout')}
          className='f3 link dim black underline pointer'
        >
          Sign Out
        </p>
      </nav>
    );
  } else {
    return (
      <nav
        class='dt w-100 border-box ph5-ns'
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <p
          onClick={() => onRouteChange('signin')}
          className='f3 link dim black underline pointer pa3'
        >
          Sign In
        </p>
        <p
          onClick={() => onRouteChange('register')}
          className='f3 link dim black underline pointer pa3'
        >
          Register
        </p>
      </nav>
    );
  }
};

export default Navigation;
