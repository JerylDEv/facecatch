import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, faceBoxes }) => {
  return (
    <div className='center-align-items ma'>
      <div className='absolute mt2'>
        <img
          hidden={imageUrl === '' ? true : false}
          id='input-image'
          src={imageUrl}
          alt='imageUrl'
          width='500px'
          height='auto'
        />
        {faceBoxes.map((box, index) => {
          return (
            <div
              key={index}
              className='bounding-box'
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
