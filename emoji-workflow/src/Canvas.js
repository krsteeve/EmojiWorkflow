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

    this.srcTextures = [];
  }

  componentDidUpdate(oldProps) {
    var imagesChanged = oldProps.images.length != this.props.images.length;
    for (var i = 0; i < this.props.images.length && !imagesChanged; ++i) {
      if (oldProps.images[i].src != this.props.images[i].src) {
        imagesChanged = true;
      }
    }

    if (imagesChanged) {
      this.updateSrcTextures(this.props.images);
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

  updateSrcTextures(images) {
    this.srcTextures = images.map((image) => {
      const canvas = document.querySelector('#glcanvas');
      const gl = canvas.getContext('webgl');

      return { texture: renderer.loadTexture(gl, image.src, gl.LINEAR), aspectRatio: image.aspectRatio };
    });
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

    this.srcTextures.forEach((element, index) => {
      if (this.props.settings[index] && this.props.settings[index].behindTemplate) {
        this.renderDynamicElement(gl, element.texture, element.aspectRatio, this.props.settings[index]);
      }
    });

    renderer.drawScene(gl, this.programInfo, this.buffers, this.bgTexture, [1.0, 1.0, 1.0], [0, 0, 0], 0, [1.0, 1.0, 1.0]);

    this.srcTextures.forEach((element, index) => {
      if (this.props.settings[index] && !this.props.settings[index].behindTemplate) {
        this.renderDynamicElement(gl, element.texture, element.aspectRatio, this.props.settings[index]);
      }
    });

    this.rafHandle = raf(this.renderGlScene.bind(this, gl, programs));
  }

  render() {
    return (
      <canvas id="glcanvas" width="160" height="160" />
    );
  }
}