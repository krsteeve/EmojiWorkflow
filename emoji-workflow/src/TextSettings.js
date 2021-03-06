import React, { Component } from 'react';
import Settings from './Settings';

var FontFaceObserver = require('fontfaceobserver');

export default class TextSettings extends Component {

  state = {
    image: {},
    liveSettings: {},
    imageSourceType: "file"
  }

  canvasSize = { width: 200, height: 200 };

  componentDidMount() {
    this.setState(state => ({ liveSettings: this.props.initialSettings, image: this.props.image }));

    var font = new FontFaceObserver(this.props.initialSettings.textStyle.fontFace);
    font.load().then(() => {
      if (this.props.image && this.props.image.text) {
        this.updateText(this.props.image.text);
      } else {
        this.updateText("This");
      }
    });
  }

  componentDidUpdate(oldProps) {
    if (this.props.initialSettings !== oldProps.initialSettings) {
      this.setState(state => ({ liveSettings: { ...state.liveSettings, ...this.props.initialSettings } }));

      var font = new FontFaceObserver(this.props.initialSettings.textStyle.fontFace);
      font.load().then(() => {
        if (this.props.image && this.props.image.text) {
          this.updateText(this.props.image.text);
        } else {
          this.updateText("This");
        }
      });
    }
  }

  onTextChange = (e) => {
    var text = e.target.value;
    this.updateText(text);
  }

  updateText(text) {
    var style = this.props.initialSettings.textStyle;
    var ctx = this.refs.textCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    ctx.font = "110px " + style.fontFace;
    ctx.textAlign = 'center'
    ctx.shadowColor = style.shadowColor;
    ctx.fillStyle = style.color;
    ctx.shadowOffsetX = style.shadowOffsetX;
    ctx.shadowOffsetY = style.shadowOffsetY;
    var textSize = ctx.measureText(text);

    console.log("kelsey", textSize.actualBoundingBoxDescent, textSize.actualBoundingBoxAscent);

    ctx.fillText(text, this.canvasSize.width / 2, (this.canvasSize.height + textSize.actualBoundingBoxAscent - textSize.actualBoundingBoxDescent) / 2, this.canvasSize.width - 30);

    var image = new Image();
    image.src = this.refs.textCanvas.toDataURL();

    image.onload = () => {
      this.setState(state => (
        {
          image: { src: image.src, aspectRatio: image.width / image.height, text: text },
          liveSettings: { ...state.liveSettings, text: text }
        }),
        () => this.props.onChange(this.state.image, this.state.liveSettings)
      );
    };
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
      <div className="AppSmall" style={{ flexWrap: "wrap", paddingLeft: 30 }}>
        <div className="AppSmall">
          <ul style={{ listStyleType: "none" }}>
            <li>{this.state.liveSettings.imageTitle}:</li>
            <li><canvas ref="textCanvas" width={this.canvasSize.width} height={this.canvasSize.height} style={{ height: 100, width: 100, border: "1px solid white", backgroundColor: this.props.initialSettings.textStyle.previewBackgroundColor }} /></li>
            <li><input type="text" onChange={this.onTextChange} style={{ width: 100, marginRight: 20 }} value={this.state.liveSettings.text} /></li>
          </ul>
        </div>

        <Settings initialSettings={this.props.initialSettings} onChange={this.updateSettings} />
      </div>
    );
  }
}