import React, { Component } from 'react';
import raf from 'raf';
import * as renderer from './Renderer'
 
export default class Canvas extends Component {

  state = {
  }
 
  componentDidMount() {
      const canvas = document.querySelector('#glcanvas');
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
      
        this.bgTexture = renderer.loadTexture(gl, this.props.backgroundImage)
      
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }

    componentDidUpdate(oldProps) {
      if (oldProps.src != this.props.src) {
        this.updateSrcTexture();
      }

      if (oldProps.backgroundImage != this.props.backgroundImage) {
        this.updateBackgroundTexture();
      }
    }

    updateBackgroundTexture() {
      const canvas = document.querySelector('#glcanvas');
      const gl = canvas.getContext('webgl');

      this.bgTexture = renderer.loadTexture(gl, this.props.backgroundImage)
    }

    updateSrcTexture() {
      var src = this.props.src;
      if (src != null) {
        const canvas = document.querySelector('#glcanvas');
        const gl = canvas.getContext('webgl');

        this.srcTexture = renderer.loadTexture(gl, src, gl.LINEAR);
      } else {
        this.srcTexture = null;
      }
    }
 
    renderGlScene(gl, programs) {
      renderer.drawStart(gl);

      if (!this.props.behindTemplate) {
        renderer.drawScene(gl, this.programInfo, this.buffers, this.bgTexture, [1.0, 1.0, 1.0], [0, 0, 0], 0, [1.0, 1.0, 1.0]);
      }

      if (this.srcTexture) {
        var x = this.props.xOffset;
        var y = this.props.yOffset;

        var scaleX = this.props.scale;
        var scaleY = this.props.scale;
        if (this.props.srcAspectRatio < 1) {
          scaleX = scaleX * this.props.srcAspectRatio;
        } else if (this.props.srcAspectRatio > 1) {
          scaleY = scaleY * 1/this.props.srcAspectRatio;
        }

        var mirrorXLeft = this.props.mirrorLeft ? -1.0 : 1.0;
        var mirrorXRight = this.props.mirrorRight ? -1.0 : 1.0;

        var rotationLeft = this.props.mirrorLeft ? -this.props.rotation : this.props.rotation;
        var rotationRight = this.props.mirrorRight ? this.props.rotation : -this.props.rotation;

        if (this.props.twoImages) {
          renderer.drawScene(gl, this.programInfo, this.buffers, this.srcTexture, [scaleX, scaleY, 1.0], [-x, y, 0], rotationLeft, [mirrorXLeft, 1.0, 1.0]);
        }

        renderer.drawScene(gl, this.programInfo, this.buffers, this.srcTexture, [scaleX, scaleY, 1.0], [x, y, 0], rotationRight, [mirrorXRight, 1.0, 1.0]);
      }

      if (this.props.behindTemplate) {
        renderer.drawScene(gl, this.programInfo, this.buffers, this.bgTexture, [1.0, 1.0, 1.0], [0, 0, 0], 0, [1.0, 1.0, 1.0]);
      }

      this.rafHandle = raf(this.renderGlScene.bind(this, gl, programs));
  }
 
    render() {
        return (
          <canvas id="glcanvas" width="160" height="160"/>
        );
    }
}