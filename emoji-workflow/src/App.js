import React from 'react';
import './App.css';
import Canvas from './Canvas';
import Slider from 'react-input-slider';

export default class App extends React.Component {
  state = {
    color: '#60aa3e',
    image: null,
    normalness: 0,
    brightness: 50,
    darkness: -50,
  }

  render() {
    return (
      <div classname="Top">
        
        <div className="App">
          <div>Junimo Generator <br/>
          <Canvas 
            tintColor={this.state.color} 
            tintTexture={this.state.image} 
            normalnessRatio={this.state.normalness / 100}
            brightnessRatio={this.state.brightness / 100}
            darknessRatio={this.state.darkness / 100}
          />
          </div>
          <div className="ImageSettings">
              Main areas: {this.state.normalness} <br/>
              <Slider axis="x" x={this.state.normalness} xmin={-100} onChange={({x}) => this.setState({normalness:x})}/><br/>
              Bright areas: {this.state.brightness} <br/>
              <Slider axis="x" x={this.state.brightness} xmin={-100} onChange={({x}) => this.setState({brightness:x})}/><br/>
              Dark areas: {this.state.darkness} <br/>
              <Slider axis="x" x={this.state.darkness} xmin={-100} onChange={({x}) => this.setState({darkness:x})}/>
            </div>
        </div>
      </div>
    );
  }
}
