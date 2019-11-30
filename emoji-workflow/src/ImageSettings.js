import React, { Component } from 'react';
import Slider from 'react-input-slider';

export default class Canvas extends Component {

  state = {
    liveSettings: {},
    imageSourceType: "file"
  }

  componentDidMount() {
    this.setState(state => ({ liveSettings: { ...state.liveSettings, ...this.props.initialSettings } }));
  }

  componentDidUpdate(oldProps) {
    if (this.props.initialSettings != oldProps.initialSettings) {
      this.setState(state => ({ liveSettings: { ...state.liveSettings, ...this.props.initialSettings } }));
    }
  }

  onImageSourceAvailable = (src) => {
    var image = new Image();

    image.crossOrigin = "";
    image.src = src;

    image.onload = () => {
      this.setState(state => (
        { liveSettings: { ...state.liveSettings, src: src, aspectRatio: image.width / image.height } }),
        () => this.props.onChange(this.state.liveSettings)
      );
    };
  }

  onSelectImage = (e) => {
    if (this.state.imageSourceType == "file") {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader()
        reader.addEventListener(
          'load',
          () => {
            this.onImageSourceAvailable(reader.result);
          },
          false
        )
        reader.readAsDataURL(e.target.files[0])
      }
    }
    else {
      this.onImageSourceAvailable("https://cors-anywhere.herokuapp.com/" + e.target.value);
    }
  }

  updateSettings(name, value) {
    this.setState(state => (
      { liveSettings: { ...state.liveSettings, [name]: value } }),
      () => this.props.onChange(this.state.liveSettings)
    );
  }

  render() {
    return (
      <div className="App">
        <div className="AppSmall">
          <ul style={{ listStyleType: "none" }}>
            <li>{this.state.liveSettings.imageTitle}:</li>
            <li><img src={this.state.liveSettings.src} style={this.state.liveSettings.src ? { height: 100, border: "1px solid white" } : { height: 100, width: 100, border: "1px solid white" }} /></li>
            <li><input type={this.state.imageSourceType} onChange={this.onSelectImage} /></li>
            <div>
              <button onClick={() => { this.setState({ imageSourceType: "file" }) }}>File</button>&nbsp;
              <button onClick={() => { this.setState({ imageSourceType: "url" }) }}>Url</button>
            </div>
          </ul>
        </div>

        <div style={{ fontSize: "calc(0px + 2vmin)" }}>
          X Offset: {this.state.liveSettings.xOffset}%<br />
          <Slider axis="x" x={this.state.liveSettings.xOffset} xmin={-100} xmax={100} onChange={({ x }) => this.updateSettings("xOffset", x)} /><br />
          Y Offset: {this.state.liveSettings.yOffset}%<br />
          <Slider axis="x" x={this.state.liveSettings.yOffset} xmin={-100} xmax={100} onChange={({ x }) => this.updateSettings("yOffset", x)} /><br />
          Scale: {this.state.liveSettings.scale}%<br />
          <Slider axis="x" x={this.state.liveSettings.scale} xmin={0} xmax={200} onChange={({ x }) => this.updateSettings("scale", x)} /><br />
          Rotation:  {this.state.liveSettings.rotation}&deg;<br />
          <Slider axis="x" x={this.state.liveSettings.rotation} xmin={-90} xmax={90} onChange={({ x }) => this.updateSettings("rotation", x)} /><br />
          Mirror Right: <input type="checkbox" checked={this.state.liveSettings.mirrorRight} onChange={(e) => this.updateSettings("mirrorRight", e.target.checked)} /><br />
          {this.state.liveSettings.twoImages &&
            <p>Mirror Left: <input type="checkbox" checked={this.state.liveSettings.mirrorLeft} onChange={(e) => this.updateSettings("mirrorLeft", e.target.checked)} /></p>
          }
        </div>
      </div>
    );
  }
}