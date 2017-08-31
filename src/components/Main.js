require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

import ReactDOM from 'react-dom';

import imageDatas from '../data/imageData.js';

(function genImageURl(imageDataArr) {
  for (let i = 0, j = imageDataArr.length; i < j; i++) {
    let singleImageData = imageDataArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.filename);
    singleImageData.index = i;
    imageDataArr[i] = singleImageData;
  }

  return imageDataArr;
})(imageDatas);

class ImgFigure extends React.Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }


    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObj = {};
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    if (this.props.arrange.rotate) {
      styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
    }

    if (this.props.arrange.zIndex) {
      styleObj['zIndex'] = this.props.arrange.zIndex;
    }

    let imgFigureClassName = "img-figure ";

    imgFigureClassName += this.props.arrange.isInverse ? 'is-inverse' : '';

    return (
      <figure id={'imgFigure' + this.props.data.index} style={styleObj} className={imgFigureClassName}
              onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    )
  }
}


class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecx: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      },
      imgsArrangeArr: []
    }
  }

  componentDidMount() {
    let stageDOM = ReactDOM.findDOMNode(this),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    let imgFigureDOM = ReactDOM.findDOMNode(imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    this.state.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    //左右两侧的图片取值范围
    this.state.hPosRange.leftSecX[0] = -halfImgW;
    this.state.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.state.hPosRange.rightSecx[0] = halfStageW + halfImgW;
    this.state.hPosRange.rightSecx[1] = stageW - halfImgW;
    this.state.hPosRange.y[0] = -halfImgH;
    this.state.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片位置的取值

    this.state.vPosRange.topY[0] = -halfImgH;
    this.state.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.state.vPosRange.x[0] = halfStageW - imgW;
    this.state.vPosRange.x[1] = halfStageW;
    this.props.rearrange(this, 0);
  }


  render() {
    let controllerUnits = [],
      imgFigures = [];
    imageDatas.map((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          zIndex: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} arrange={this.state.imgsArrangeArr[index]}
                                 inverse={this.props.inverse(this, index)} center={this.props.center(this, index)}/>)
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {

  center: function (me, index) {
    return function () {
      this.rearrange(me, index);
    }.bind(this);
  },

  inverse: function (me, index) {
    return function () {
      let imgsArrangeArr = me.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      me.setState({imgsArrangeArr: imgsArrangeArr});
    }
  },


  get30DegRandom: function () {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30))
  },

  getRangeRandom: function (low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  },

  rearrange: function (me, centerIndex) {
    let imgsArrangeArr = me.state.imgsArrangeArr,
      centerPos = me.state.centerPos,
      hPosRange = me.state.hPosRange,
      vPosRange = me.state.vPosRange,

      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecx,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.ceil(Math.random() * 2),
      topImgSplitIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //中间

    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      zIndex: 10000,
      isCenter: true
    }


    //上面

    topImgSplitIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSplitIndex, topImgNum);

    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    });

    //左右
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }

    }
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      if (imgsArrangeTopArr.length == 1) {
        imgsArrangeArr.splice(topImgSplitIndex, 0, imgsArrangeTopArr[0])
      } else {
        imgsArrangeArr.splice(topImgSplitIndex, 0, imgsArrangeTopArr[0], imgsArrangeTopArr[1])
      }
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    me.setState({imgsArrangeArr: imgsArrangeArr});
  }
}
;

export default AppComponent;




