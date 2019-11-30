import React, { Component } from 'react';
import raf from 'raf';
import * as renderer from './Renderer'

export default class Canvas extends Component {

  componentDidMount() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false });

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
    if (oldProps.settings.src != this.props.settings.src) {
      this.updateSrcTexture(this.props.settings.src);
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

  updateSrcTexture(src) {
    if (src != null) {
      const canvas = document.querySelector('#glcanvas');
      const gl = canvas.getContext('webgl');

      this.srcTexture = renderer.loadTexture(gl, src, gl.LINEAR);
    } else {
      this.srcTexture = null;
    }
  }

  renderDynamicElement(gl, texture, aspectRatio, settings) {
    const x = settings.xOffset;
    const y = settings.yOffset;

    var scaleX = settings.scale;
    var scaleY = settings.scale;
    if (aspectRatio < 1) {
      scaleX = scaleX * aspectRatio;
    } else if (aspectRatio > 1) {
      scaleY = scaleY * 1 / aspectRatio;
    }

    const mirrorXLeft = settings.mirrorLeft ? -1.0 : 1.0;
    const mirrorXRight = settings.mirrorRight ? -1.0 : 1.0;

    const rotationLeft = settings.mirrorLeft ? -settings.rotation : settings.rotation;
    const rotationRight = settings.mirrorRight ? settings.rotation : -settings.rotation;

    if (settings.twoImages) {
      renderer.drawScene(gl, this.programInfo, this.buffers, texture, [scaleX, scaleY, 1.0], [-x, y, 0], rotationLeft, [mirrorXLeft, 1.0, 1.0]);
    }

    renderer.drawScene(gl, this.programInfo, this.buffers, texture, [scaleX, scaleY, 1.0], [x, y, 0], rotationRight, [mirrorXRight, 1.0, 1.0]);
  }

  renderGlScene(gl, programs) {
    renderer.drawStart(gl);

    if (!this.props.settings.behindTemplate) {
      renderer.drawScene(gl, this.programInfo, this.buffers, this.bgTexture, [1.0, 1.0, 1.0], [0, 0, 0], 0, [1.0, 1.0, 1.0]);
    }

    if (this.srcTexture) {
      this.renderDynamicElement(gl, this.srcTexture, this.props.settings.aspectRatio, this.props.settings);
    }

    if (this.props.settings.behindTemplate) {
      renderer.drawScene(gl, this.programInfo, this.buffers, this.bgTexture, [1.0, 1.0, 1.0], [0, 0, 0], 0, [1.0, 1.0, 1.0]);
    }

    this.rafHandle = raf(this.renderGlScene.bind(this, gl, programs));
  }

  render() {
    return (
      <canvas id="glcanvas" width="160" height="160" />
    );
  }
}