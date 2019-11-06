import React from 'react';
import './App.css';
import Canvas from './Canvas';
import Slider from 'react-input-slider';

export default class App extends React.Component {
  state = {
    src: null,
    aspectRatio:1,
    yOffset:0,
    xOffset:0,
    scaleFactor:100,
    mirrorRightEye:false,
    mirrorLeftEye:false,
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

  onMirrorRightEyeToggle = e => {

  }

  render() {
    return (
      <div classname="Top">
        
        <div className="App">
          <div>Emoji Workflow<br/>
            <Canvas 
              eyeSrc={this.state.src}
              eyeSrcAspectRatio={this.state.aspectRatio}
              eyeXOffset={this.state.xOffset / 100}
              eyeYOffset={this.state.yOffset / 100}
              eyeScaleFactor={this.state.scaleFactor / 100}
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
              Mirror Right Eye: <input type="checkbox" onChange={(e) => this.setState({mirrorRightEye:e.target.checked})}/><br/>
              Mirror Left Eye: <input type="checkbox" onChange={(e) => this.setState({mirrorLeftEye:e.target.checked})}/><br/>
          </div>
        </div>
      </div>
    );
  }
}
