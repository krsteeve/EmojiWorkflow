import React from 'react';
import './App.css';
import Canvas from './Canvas';
import CanvasAtReaction from './CanvasAtReaction'
import Slider from 'react-input-slider';
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'

import blankEyes from './faceImages/blank_eyes.png'
import blankEyesDefaults from './faceImages/blank_eyes.json'

var images = [];
var defaults = [];

export default class App extends React.Component {
  state = {
    eyesSrc: null,
    backgroundImage:blankEyes,
    aspectRatio:1,
    atReactionSrc:null,
    atReactionAspectRatio:1,
    eyesSettings: blankEyesDefaults,
    imageSourceType:"file"
  }

  componentWillMount() {
    var req = require.context('./faceImages/', false, /\.(png|jpe?g|svg)$/);
    var keys = req.keys(); // keys contains the file names eg "./blank_eyes.png"
    images = keys.map(req);

    keys.forEach(function(key) {
      try {
        var jsonFile = require('./faceImages/' + key.substring(2, key.lastIndexOf('.')) + '.json');
        defaults.push(jsonFile);
      } catch(e) {
        defaults.push({});
      }
    });
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

  builtinImageChosen = (image) => {
    this.setState(state => ({backgroundImage:image.src, eyesSettings:{...state.eyesSettings, ...defaults[image.value]}}));
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
      this.onImageSourceAvailable("https://cors-anywhere.herokuapp.com/" + e.target.value, type);
    }
  }

  onSelectBGFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () =>
        {
          var image = new Image();

          image.src = reader.result;

          image.onload = () => {
              this.setState({
                backgroundImage: reader.result,
              })
          };
        },
        false
      )
      reader.readAsDataURL(e.target.files[0])
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
              eyeXOffset={this.state.eyesSettings.xOffset / 100}
              eyeYOffset={this.state.eyesSettings.yOffset / 100}
              eyeScaleFactor={this.state.eyesSettings.scaleFactor / 100}
              eyeRotation={this.state.eyesSettings.rotation * Math.PI / 180}
              mirrorRightEye={this.state.eyesSettings.mirrorRightEye}
              mirrorLeftEye={this.state.eyesSettings.mirrorLeftEye}
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
              X Offset: {this.state.eyesSettings.xOffset}%<br/>
              <Slider axis="x" x={this.state.eyesSettings.xOffset} xmin={0} xmax={100} onChange={({x}) => this.setState(p => ({eyesSettings: {...p.eyesSettings, xOffset:x}}))}/><br/>
              Y Offset: {this.state.eyesSettings.yOffset}%<br/>
              <Slider axis="x" x={this.state.eyesSettings.yOffset} xmin={-100} xmax={100} onChange={({x}) => this.setState(p => ({eyesSettings: {...p.eyesSettings, yOffset:x}}))}/><br/>
              Scale Factor: {this.state.eyesSettings.scaleFactor}%<br/>
              <Slider axis="x" x={this.state.eyesSettings.scaleFactor} xmin={0} xmax={100} onChange={({x}) => this.setState(p => ({eyesSettings: {...p.eyesSettings, scaleFactor:x}}))}/><br/>
              Rotation:  {this.state.eyesSettings.rotation}&deg;<br/>
              <Slider axis="x" x={this.state.eyesSettings.rotation} xmin={-45} xmax={45} onChange={({x}) => this.setState(p => ({eyesSettings: {...p.eyesSettings, rotation:x}}))}/><br/>
              Mirror Right Eye: <input type="checkbox" onChange={(e) => { var target = e.target; this.setState(p => ({eyesSettings: {...p.eyesSettings, mirrorRightEye:target.checked}}))}}/><br/>
              Mirror Left Eye: <input type="checkbox" onChange={(e) => { var target = e.target; this.setState((p) => ({eyesSettings: {...p.eyesSettings, mirrorLeftEye:target.checked}}))}}/><br/>
          </div>
        </div>
        <div>
          Choose a background image:<br/>
          <ImagePicker
            images={images.map((image, i) => ({src: image, value: i}))}
            onPick={this.builtinImageChosen}/>
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
