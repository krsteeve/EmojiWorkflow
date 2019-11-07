import React from 'react';
import './App.css';
import Canvas from './Canvas';
import CanvasAtReaction from './CanvasAtReaction'
import Slider from 'react-input-slider';
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'

import blankEyes from './faceImages/blank_eyes.png'

var images = [];

export default class App extends React.Component {
  state = {
    eyesSrc: null,
    backgroundImage:blankEyes,
    aspectRatio:1,
    atReactionSrc:null,
    atReactionAspectRatio:1,
    yOffset:0,
    xOffset:0,
    scaleFactor:100,
    rotation:0,
    mirrorRightEye:false,
    mirrorLeftEye:false,
    imageSourceType:"file"
  }

  importAll(r) {
    return r.keys().map(r);
  }
  componentWillMount() {
    images = this.importAll(require.context('./faceImages/', false, /\.(png|jpe?g|svg)$/));
  }

  onImageSourceAvailable = (src, type) => {
    var image = new Image();

    image.crossOrigin = "";
    image.src = src;

    image.onload = () => {
      var newState = {aspectRatio: image.width / image.height};
      newState[type] = src;
      console.log(type)
      this.setState(newState)
    };
  } 

  onSelectImage = (type, e) => {
    if (this.state.imageSourceType == "file") {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader()
        reader.addEventListener(
          'load',
          () =>
          {
            this.onImageSourceAvailable(reader.result, type);
          },
          false
        )
        reader.readAsDataURL(e.target.files[0])
      }
    }
    else {
      this.onImageSourceAvailable(e.target.value, type);
    }
  }


  render() {
    return (
      <div classname="Top">
        <div className="App">
          <div>Emoji Workflow<br/>
            <Canvas
              backgroundImage={this.state.backgroundImage}
              eyeSrc={this.state.eyesSrc}
              eyeSrcAspectRatio={this.state.aspectRatio}
              eyeXOffset={this.state.xOffset / 100}
              eyeYOffset={this.state.yOffset / 100}
              eyeScaleFactor={this.state.scaleFactor / 100}
              eyeRotation={this.state.rotation * Math.PI / 180}
              mirrorRightEye={this.state.mirrorRightEye}
              mirrorLeftEye={this.state.mirrorLeftEye}
            />
          </div>
          <div style={{}}>
              <ul style={{listStyleType: "none"}}>
                <li><input type={this.state.imageSourceType} onChange={this.onSelectImage.bind(this, "eyesSrc")}/></li>
                <div>
                  <button onClick={() => { this.setState({imageSourceType: "file"}) }}>File</button>
                  &nbsp;
                  <button onClick={() => { this.setState({imageSourceType: "url"}) }}>Url</button>
                </div>
              </ul>
            <div>
              <img src={this.state.eyesSrc} style={{maxHeight:100}}/>
            </div>
          </div>
          
          <div style={{padding: "50px"}}>
              X Offset: {this.state.xOffset}%<br/>
              <Slider axis="x" x={this.state.xOffset} xmin={0} xmax={100} onChange={({x}) => this.setState({xOffset:x})}/><br/>
              Y Offset: {this.state.yOffset}%<br/>
              <Slider axis="x" x={this.state.yOffset} xmin={-100} xmax={100} onChange={({x}) => this.setState({yOffset:x})}/><br/>
              Scale Factor: {this.state.scaleFactor}%<br/>
              <Slider axis="x" x={this.state.scaleFactor} xmin={0} xmax={100} onChange={({x}) => this.setState({scaleFactor:x})}/><br/>
              Rotation:  {this.state.rotation}&deg;<br/>
              <Slider axis="x" x={this.state.rotation} xmin={-45} xmax={45} onChange={({x}) => this.setState({rotation:x})}/><br/>
              Mirror Right Eye: <input type="checkbox" onChange={(e) => this.setState({mirrorRightEye:e.target.checked})}/><br/>
              Mirror Left Eye: <input type="checkbox" onChange={(e) => this.setState({mirrorLeftEye:e.target.checked})}/><br/>
          </div>
        </div>
        <div>
          Choose a background image:<br/>
          <ImagePicker
            images={images.map((image, i) => ({src: image, value: i}))}
            onPick={ (image) => {
              this.setState({backgroundImage:image.src});
            }}/>
        </div>
        <div>
          Or choose a custom image:
          <input type="file" onChange={this.onSelectBGFile} style={{alignSelf:'top'}}/>
        </div>
        <div class="App">
            <div>At Reaction Workflow<br/>
              <CanvasAtReaction
                backgroundImage={this.state.atReactionSrc}
                aspectRatio={this.state.atReactionAspectRatio}
              />
            </div>
            <input type={this.state.imageSourceType} onChange={this.onSelectImage.bind(this, "atReactionSrc")} style={{alignSelf:'top'}}/>
        </div>
      </div>
    );
  }
}
