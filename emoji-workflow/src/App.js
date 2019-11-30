import React from 'react';
import './App.css';
import Canvas from './Canvas';
import ImageSettings from './ImageSettings'
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
    liveSettings: { ...blankEyesDefaults["settings"][0] },
    initialSettings: { ...blankEyesDefaults["settings"][0] },
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

  builtinImageChosen = (image) => {
    this.setState(state => ({ backgroundImage: image.src, liveSettings: { ...state.liveSettings, ...defaults[image.value] }, initialSettings: { ...state.liveSettings, ...defaults[image.value] } }));
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
              settings={this.transformPropsForCanvas(this.state.liveSettings)}
            />
          </div>
          <ImageSettings
            initialSettings={this.state.initialSettings}
            onChange={(settings) => this.setState({ liveSettings: settings })}
          />
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
