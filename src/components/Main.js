require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');

let imageDatas = require('../data/imageData.json');

imageDatas = (function genImageURl(imageDataArr) {
  for (let i = 0, j = imageDataArr.length; i < j; i++) {
    let singleImageData = imageDataArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.filename);
    imageDataArr[i] = singleImageData;
  }

  return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
