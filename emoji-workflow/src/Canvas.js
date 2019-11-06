import React, { Component } from 'react';
import raf from 'raf';
import * as renderer from './Renderer'
import blankEyes from './blank_eyes.png'

var Color = require('color');
 
export default class Canvas extends Component {

  state = {
  }
 
  componentDidMount() {
      const canvas = document.querySelector('#glcanvas');
      const gl = canvas.getContext('webgl');

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
      
        this.textures = [
          { 
            texture: renderer.loadTexture(gl, blankEyes, gl.NEAREST), 
            tint:{r:0, g:0, b:0, a:1}, 
            tintTexture: null,
            brightness:0
          },
        ];

        this.updateColors();
      
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    componentDidUpdate(oldProps) {
      this.updateColors();

      if (oldProps.tintTexture != this.props.tintTexture) {
        this.updateTexture();
      }
    }

    updateColors() {
      var color = Color(this.props.tintColor);

    }

    updateTexture() {
      var tintTexture = this.props.tintTexture;
      if (tintTexture != null) {
        const canvas = document.querySelector('#glcanvas');
        const gl = canvas.getContext('webgl');

        var texture = renderer.loadTexture(gl, tintTexture, gl.LINEAR, this.buffers.tintTextureCoord);
        this.textures[1].tintTexture = texture;
        this.textures[2].tintTexture = texture;
        this.textures[3].tintTexture = texture;
      } else {
        this.textures[1].tintTexture = null;
        this.textures[2].tintTexture = null;
        this.textures[3].tintTexture = null;
      }
    }
 
    renderGlScene(gl, programs) {

      renderer.drawStart(gl);

      this.textures.forEach(function(texture, index) {
        renderer.drawScene(gl, this.programInfo, this.buffers, texture.texture, texture.tint, texture.tintTexture, texture.brightness);
      }, this);

      this.rafHandle = raf(this.renderGlScene.bind(this, gl, programs));
  }
 
    render() {
        return (
          <canvas id="glcanvas" width="640" height="480"></canvas>
        );
    }
}