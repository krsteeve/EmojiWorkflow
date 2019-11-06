import React from 'react';
import './App.css';
import Canvas from './Canvas';
import Slider from 'react-input-slider';
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'

import blankEyes from './faceImages/blank_eyes.png'

var images = [];

export default class App extends React.Component {
  state = {
    src: null,
    backgroundImage:blankEyes,
    aspectRatio:1,
    yOffset:0,
    xOffset:0,
    scaleFactor:100,
    rotation:0,
    mirrorRightEye:false,
    mirrorLeftEye:false,
  }

  importAll(r) {
    return r.keys().map(r);
  }
  componentWillMount() {
    images = this.importAll(require.context('./faceImages/', false, /\.(png|jpe?g|svg)$/));
  }

  onSelectFile = e => {
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
                src: reader.result,
                aspectRatio: image.width / image.height,
              })
          };
        },
        false
      )
      reader.readAsDataURL(e.target.files[0])
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
              eyeSrc={this.state.src}
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
            <input type="file" onChange={this.onSelectFile} style={{alignSelf:'top'}}/>
            <div>
              <img src={this.state.src} style={{maxHeight:100}}/>
            </div>
          </div>
          
          <div className="ImageSettings">
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
      </div>
    );
  }
}
