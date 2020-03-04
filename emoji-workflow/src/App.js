import React from 'react';
import './App.css';
import Canvas from './Canvas';
import ImageSettings from './ImageSettings'
import TextSettings from './TextSettings'
import Slider from 'react-input-slider';
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'

import blankEyes from './faceImages/blank_eyes.png'
import blankEyesDefaults from './faceImages/blank_eyes.json'

import GitHubButton from 'react-github-btn'

var images = [];
var defaults = [];

export default class App extends React.Component {
  state = {
    backgroundImage: blankEyes,
    images: [],
    liveSettings: blankEyesDefaults["settings"],
    initialSettings: blankEyesDefaults["settings"],
    imageSourceType: "file"
  }

  componentWillMount() {
    var req = require.context('./faceImages/', false, /\.(png|jpe?g|svg)$/);
    var keys = req.keys(); // keys contains the file names eg "./blank_eyes.png"
    images = keys.map(req);

    keys.forEach(function (key) {
      try {
        var jsonFile = require('./faceImages/' + key.substring(2, key.lastIndexOf('.')) + '.json');
        defaults.push(jsonFile["settings"]);
      } catch (e) {
        defaults.push({});
      }
    });
  }

  builtinImageChosen = (image) => {
    this.setState(state => ({ backgroundImage: image.src, liveSettings: defaults[image.value], initialSettings: defaults[image.value] }));
  }

  transformPropsForCanvas(settings) {
    var result = Object.assign({}, settings);
    result.xOffset /= 100;
    result.yOffset /= 100;
    result.scale /= 100;
    result.rotation *= Math.PI / 180;
    return result;
  }

  updateLiveSettings(index, image, settings) {
    this.setState(state => {
      const liveSettings = state.liveSettings.map((value, i) => {
        if (index === i) {
          return settings;
        } else {
          return value;
        }
      });

      var images = state.images.map((value, i) => {
        if (index === i) {
          return image;
        } else {
          return value;
        }
      });

      while (index >= images.length) {
        if (images.length === index) {
          images.push(image);
        } else {
          images.push({});
        }
      }

      return { images: images, liveSettings: liveSettings }
    }
    );
  }

  render() {
    const year = (new Date()).getFullYear();
    return (
      <div className="Top" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <a href="https://github.com/krsteeve/EmojiWorkflow" style={{ position: 'absolute', top: 0, right: 0 }}>
          <img width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_white_ffffff.png?resize=149%2C149" className="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1" />
        </a>
        <div className="App" style={{ flexGrow: 2 }}>
          <div>Emoji Workflow<br />
            <Canvas
              backgroundImage={this.state.backgroundImage}
              images={this.state.images}
              settings={this.state.liveSettings.map(ls => this.transformPropsForCanvas(ls))}
            />
          </div>
          {this.state.initialSettings.map(
            (value, index, array) => {

              if (value.isText) {
                return (<TextSettings
                  initialSettings={value}
                  image={this.state.images[index]}
                  onChange={(image, settings) => this.updateLiveSettings(index, image, settings)}
                />);
              } else {
                return (<ImageSettings
                  initialSettings={value}
                  image={this.state.images[index]}
                  onChange={(image, settings) => this.updateLiveSettings(index, image, settings)}
                />);
              }

            })}

        </div>
        <div className="App">
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="App" style={{ paddingTop: 30 }}>
              Choose a background image:<br />
              <ImagePicker
                images={images.map((image, i) => ({ src: image, value: i }))}
                onPick={this.builtinImageChosen} />
            </div>
          </div>
        </div>
        <div className="Footer" style={{ padding: 20 }}>
          <div className="FooterGH" style={{ paddingBottom: 10 }}>
            Find Emoji Workflow on GitHub:{' '}
            <GitHubButton href="https://github.com/krsteeve/EmojiWorkflow" data-icon="octicon-star" data-show-count="true" aria-label="Star krsteeve/EmojiWorkflow on GitHub">Star</GitHubButton>
            {' '}
            <GitHubButton href="https://github.com/krsteeve/EmojiWorkflow/fork" data-icon="octicon-repo-forked" data-show-count="true" aria-label="Fork krsteeve/EmojiWorkflow on GitHub">Fork</GitHubButton>
            {' '}
            <GitHubButton href="https://github.com/krsteeve/EmojiWorkflow/issues" data-icon="octicon-issue-opened" data-show-count="true" aria-label="Issue krsteeve/EmojiWorkflow on GitHub">Report an Issue</GitHubButton>
          </div>
          Copyright &copy; {year} Kelsey Steeves
        </div>
      </div>
    );
  }
}
