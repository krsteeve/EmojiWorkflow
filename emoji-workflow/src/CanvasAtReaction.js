import React, { Component } from 'react';
import raf from 'raf';
import * as renderer from './Renderer'

import atReaction from './at_reaction.png'
 
export default class Canvas extends Component {

  state = {
  }
 
  componentDidMount() {
      const canvas = document.querySelector('#glcanvas-atreaction');
      const gl = canvas.getContext('webgl', {premultipliedAlpha: false});

        // If we don't have a GL context, give up now
        if (!gl) {
          alert('Unable to initialize WebGL. Your browser or machine may not support it.');
          return;
        }

        this.rafHandle = raf(this.renderGlScene.bind(this, gl));

        this.programInfo = renderer.getTextureShaderProgram(gl);
      
        // Here's where we call the routine that builds all the
        // objects we'll be drawing.
        this.buffers = renderer.initBuffers(gl);
      
        //this.bgTexture = renderer.loadTexture(gl, this.props.backgroundImage)
        this.atReactionTexture = renderer.loadTexture(gl, atReaction);
      
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }

    componentDidUpdate(oldProps) {
      if (oldProps.eyeSrc != this.props.eyeSrc) {
        this.updateEyeTexture();
      }

      if (oldProps.backgroundImage != this.props.backgroundImage) {
        this.updateBackgroundTexture();
      }
    }

    updateBackgroundTexture() {
      const canvas = document.querySelector('#glcanvas-atreaction');
      const gl = canvas.getContext('webgl');

      this.bgTexture = renderer.loadTexture(gl, this.props.backgroundImage)
    }

    updateEyeTexture() {
      var eyeSrc = this.props.eyeSrc;
      if (eyeSrc != null) {
        const canvas = document.querySelector('#glcanvas-atreaction');
        const gl = canvas.getContext('webgl');

        this.eyeTexture = renderer.loadTexture(gl, eyeSrc, gl.LINEAR);
      } else {
        this.eyeTexture = null;
      }
    }
 
    renderGlScene(gl, programs) {
      renderer.drawStart(gl);

      if (this.bgTexture != null) {
        var scaleX = 1.0;
        var scaleY = 1.0;
        if (this.props.aspectRatio < 1) {
          scaleX = scaleX * this.props.aspectRatio;
        } else if (this.props.aspectRatio > 1) {
          scaleY = scaleY * 1/this.props.aspectRatio;
        }

        renderer.drawScene(gl, this.programInfo, this.buffers, this.bgTexture, [scaleX, scaleY, 1.0], [0, 0, 0], 0);
      }

      renderer.drawScene(gl, this.programInfo, this.buffers, this.atReactionTexture, [.5, .5, 1.0], [-.5, -.6, 0], 0);

      this.rafHandle = raf(this.renderGlScene.bind(this, gl, programs));
  }
 
    render() {
        return (
          <canvas id="glcanvas-atreaction" width="160" height="160"/>
        );
    }
}