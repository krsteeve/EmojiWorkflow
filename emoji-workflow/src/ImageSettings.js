import React, { Component } from 'react';
import Settings from './Settings';

export default class ImageSettings extends Component {

  state = {
    image: {},
    liveSettings: {},
    imageSourceType: "file"
  }

  componentDidMount() {
    this.setState(state => ({ liveSettings: { ...state.liveSettings, ...this.props.initialSettings }, image: this.props.image }));

    this.props.onChange(this.props.image, this.props.initialSettings);
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
        { image: { src: src, aspectRatio: image.width / image.height } }),
        () => this.props.onChange(this.state.image, this.state.liveSettings)
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

  updateSettings = (newSettings) => {
    this.setState(state => (
      { liveSettings: newSettings }),
      () => {
        if (this.state.image != null) {
          this.props.onChange(this.state.image, this.state.liveSettings)
        }
      }
    );
  }

  render() {
    return (
      <div className="App">
        <div className="AppSmall">
          <ul style={{ listStyleType: "none" }}>
            <li>{this.state.liveSettings.imageTitle}:</li>
            <li><img src={this.state.image ? this.state.image.src : null} style={this.state.image ? { height: 100, border: "1px solid white" } : { height: 100, width: 100, border: "1px solid white" }} /></li>
            <li><input type={this.state.imageSourceType} onChange={this.onSelectImage} /></li>
            <div>
              <button onClick={() => { this.setState({ imageSourceType: "file" }) }}>File</button>&nbsp;
              <button onClick={() => { this.setState({ imageSourceType: "url" }) }}>Url</button>
            </div>
          </ul>
        </div>

        <Settings initialSettings={this.props.initialSettings} onChange={this.updateSettings} />
      </div>
    );
  }
}