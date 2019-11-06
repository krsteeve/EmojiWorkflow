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
            texture: renderer.loadTexture(gl, blankEyes, gl.LINEAR)
          },
        ];
      
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    componentDidUpdate(oldProps) {

    }

 
    renderGlScene(gl, programs) {
      renderer.drawStart(gl);

      this.textures.forEach(function(texture, index) {
        renderer.drawScene(gl, this.programInfo, this.buffers, texture.texture);
      }, this);

      this.rafHandle = raf(this.renderGlScene.bind(this, gl, programs));
  }
 
    render() {
        return (
          <canvas id="glcanvas" width="640" height="480"></canvas>
        );
    }
}