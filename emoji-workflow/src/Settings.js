import React, { Component } from 'react';
import Slider from 'react-input-slider';

export default class ImageSettings extends Component {
  state = {
    liveSettings: {},
  }

  componentDidMount() {
    this.setState(state => ({ liveSettings: { ...state.liveSettings, ...this.props.initialSettings } }));
  }

  componentDidUpdate(oldProps) {
    if (this.props.initialSettings !== oldProps.initialSettings) {
      this.setState(state => ({ liveSettings: { ...state.liveSettings, ...this.props.initialSettings } }));
    }
  }

  updateSettings(name, value) {
    this.setState(state => (
      { liveSettings: { ...state.liveSettings, [name]: value } }),
      () => {
        this.props.onChange(this.state.liveSettings)
      }
    );
  }

  render() {
    return (
      <div style={{ fontSize: "calc(6px + 1vmin)" }}>
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
    );
  }
}