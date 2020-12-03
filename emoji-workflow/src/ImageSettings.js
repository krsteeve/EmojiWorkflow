import React, { Component } from 'react';
import Settings from './Settings';
import Loader from "react-spinners/GridLoader";

export default class ImageSettings extends Component {

  state = {
    image: {},
    liveSettings: {},
    imageSourceType: "file",
    loading: false,
    error: false,
  }

  componentDidMount() {
    this.setState(state => ({ liveSettings: { ...state.liveSettings, ...this.props.initialSettings }, image: this.props.image }));

    this.props.onChange(this.props.image, this.props.initialSettings);
  }

  componentDidUpdate(oldProps) {
    if (this.props.initialSettings !== oldProps.initialSettings) {
      this.setState(state => ({ liveSettings: { ...state.liveSettings, ...this.props.initialSettings } }));
    }
  }

  onImageSourceAvailable = (src) => {
    var image = new Image();

    image.onload = () => {
      this.setState(state => (
        { image: { src: src, aspectRatio: image.width / image.height, width: image.width }, loading: false }),
        () => this.props.onChange(this.state.image, this.state.liveSettings)
      );
    };

    image.onerror = () => {
      this.setState({ loading: false, error: true });
    };

    this.setState({ loading: true });

    image.crossOrigin = "";
    image.src = src;
  }

  onSelectImage = (e) => {
    this.setState({ error: false });

    if (this.state.imageSourceType === "file") {
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
    else if (e.target.value.length > 0) {
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
    const imageWidth = this.state.image ? this.state.image.aspectRatio * 100 : 100;
    const loaderSize = Math.min(100, imageWidth) * 0.25;
    const loaderMargin = (Math.min(100, imageWidth) * 0.08) + Math.max((imageWidth - 100) / 2.0, 0);
    return (
      <div className="AppSmall" style={{ flexWrap: "wrap", paddingLeft: 30 }}>
        <div className="AppSmall" style={{ paddingRight: 5 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ justifyContent: "center" }}>{this.state.liveSettings.imageTitle}:</div>
            <div style={{ display: "flex" }}>
              <img
                src={this.state.image ? this.state.image.src : null}
                style={{
                  height: 100,
                  width: imageWidth,
                  border: "1px solid white"
                }}
                alt=""
              />
              <div style={{ position: "absolute", display: "flex", alignSelf: "center", marginLeft: loaderMargin }}>
                <Loader
                  size={loaderSize}
                  color={"white"}
                  loading={this.state.loading}
                />
              </div>
            </div>
            <div>
              {this.state.imageSourceType === "url" ? "URL: " : ""}
              <input type={this.state.imageSourceType} onChange={this.onSelectImage} style={{ border: this.state.error ? "4px solid red" : "" }} />
            </div>
            <div style={{ alignItems: "center" }}>
              <button onClick={() => { this.setState({ imageSourceType: "file", error: false }) }}>File</button>&nbsp;
              <button onClick={() => { this.setState({ imageSourceType: "url", error: false }) }}>Url</button>
            </div>
          </div>
        </div>

        <Settings initialSettings={this.props.initialSettings} onChange={this.updateSettings} />
      </div>
    );
  }
}