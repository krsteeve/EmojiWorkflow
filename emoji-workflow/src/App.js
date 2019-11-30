import React from 'react';
import './App.css';
import Canvas from './Canvas';
import Slider from 'react-input-slider';
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'

import blankEyes from './faceImages/nice_blank_eyes.png'
import blankEyesDefaults from './faceImages/nice_blank_eyes.json'

var images = [];
var defaults = [];

export default class App extends React.Component {
  state = {
    backgroundImage: blankEyes,
    eyesSettings: { ...blankEyesDefaults["settings"][0], src: null, aspectRatio: 1 },
    imageSourceType: "file"
  }

  componentWillMount() {
    var req = require.context('./faceImages/', false, /\.(png|jpe?g|svg)$/);
    var keys = req.keys(); // keys contains the file names eg "./blank_eyes.png"
    images = keys.map(req);

    keys.forEach(function (key) {
      try {
        var jsonFile = require('./faceImages/' + key.substring(2, key.lastIndexOf('.')) + '.json');
        defaults.push(jsonFile["settings"][0]);
      } catch (e) {
        defaults.push({});
      }
    });
  }

  onImageSourceAvailable = (src) => {
    var image = new Image();

    image.crossOrigin = "";
    image.src = src;

    image.onload = () => {
      this.setState(state => ({ eyesSettings: { ...state.eyesSettings, src: src, aspectRatio: image.width / image.height } }));
    };
  }

  builtinImageChosen = (image) => {
    this.setState(state => ({ backgroundImage: image.src, eyesSettings: { ...state.eyesSettings, ...defaults[image.value] } }));
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

  onSelectBGFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () => {
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

  transformPropsForCanvas(settings) {
    var result = Object.assign({}, settings);
    result.xOffset /= 100;
    result.yOffset /= 100;
    result.scale /= 100;
    result.rotation *= Math.PI / 180;
    return result;
  }

  render() {
    return (
      <div className="Top" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div className="App" style={{ flexGrow: 2 }}>
          <div>Emoji Workflow<br />
            <Canvas
              backgroundImage={this.state.backgroundImage}
              settings={this.transformPropsForCanvas(this.state.eyesSettings)}
            />
          </div>
          <div className="AppSmall">
            <ul style={{ listStyleType: "none" }}>
              <li>{this.state.eyesSettings.imageTitle}:</li>
              <li><img src={this.state.eyesSettings.src} style={this.state.eyesSettings.src ? { height: 100, border: "1px solid white" } : { height: 100, width: 100, border: "1px solid white" }} /></li>
              <li><input type={this.state.imageSourceType} onChange={this.onSelectImage} /></li>
              <div>
                <button onClick={() => { this.setState({ imageSourceType: "file" }) }}>File</button>
                &nbsp;
                  <button onClick={() => { this.setState({ imageSourceType: "url" }) }}>Url</button>
              </div>
            </ul>
          </div>

          <div style={{ fontSize: "calc(0px + 2vmin)" }}>
            X Offset: {this.state.eyesSettings.xOffset}%<br />
            <Slider axis="x" x={this.state.eyesSettings.xOffset} xmin={-100} xmax={100} onChange={({ x }) => this.setState(p => ({ eyesSettings: { ...p.eyesSettings, xOffset: x } }))} /><br />
            Y Offset: {this.state.eyesSettings.yOffset}%<br />
            <Slider axis="x" x={this.state.eyesSettings.yOffset} xmin={-100} xmax={100} onChange={({ x }) => this.setState(p => ({ eyesSettings: { ...p.eyesSettings, yOffset: x } }))} /><br />
            Scale: {this.state.eyesSettings.scale}%<br />
            <Slider axis="x" x={this.state.eyesSettings.scale} xmin={0} xmax={200} onChange={({ x }) => this.setState(p => ({ eyesSettings: { ...p.eyesSettings, scale: x } }))} /><br />
            Rotation:  {this.state.eyesSettings.rotation}&deg;<br />
            <Slider axis="x" x={this.state.eyesSettings.rotation} xmin={-90} xmax={90} onChange={({ x }) => this.setState(p => ({ eyesSettings: { ...p.eyesSettings, rotation: x } }))} /><br />
            Mirror Right: <input type="checkbox" checked={this.state.eyesSettings.mirrorRight} onChange={(e) => { var target = e.target; this.setState(p => ({ eyesSettings: { ...p.eyesSettings, mirrorRight: target.checked } })) }} /><br />
            {this.state.eyesSettings.twoImages &&
              <p>Mirror Left: <input type="checkbox" checked={this.state.eyesSettings.mirrorLeft} onChange={(e) => { var target = e.target; this.setState((p) => ({ eyesSettings: { ...p.eyesSettings, mirrorLeft: target.checked } })) }} /></p>
            }
          </div>
        </div>
        <div className="App">
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="App" style={{ paddingTop: 30 }}>
              Choose a background image:<br />
              <ImagePicker
                images={images.map((image, i) => ({ src: image, value: i }))}
                onPick={this.builtinImageChosen} />
            </div>
            <div className="AppSmall">
              Or choose a custom image:&nbsp;&nbsp;<input type="file" onChange={this.onSelectBGFile} style={{ alignSelf: 'top' }} />
            </div>
          </div>
        </div>
        <div className="Footer" style={{ height: 40 }}>
        </div>
      </div>
    );
  }
}
