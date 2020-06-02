import React from 'react';

const FaceRecognition = ({ inputImage }) => {
  console.log('inputImage:::', inputImage);
  return (
    <div className='center-align-items'>
      <img src={inputImage} alt='image' />
    </div>
  );
};

export default FaceRecognition;
