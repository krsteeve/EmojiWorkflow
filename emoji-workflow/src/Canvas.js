import React, { Component } from 'react';
import raf from 'raf';
import * as renderer from './Renderer'

import { saveAs } from 'file-saver';

export default class Canvas extends Component {

  componentDidMount() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, preserveDrawingBuffer: true });

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
    var imagesChanged = oldProps.images.length !== this.props.images.length;
    for (var i = 0; i < this.props.images.length && !imagesChanged; ++i) {
      if ((oldProps.images[i] && !this.props.images[i]) || (!oldProps.images[i] && this.props.images[i])) {
        imagesChanged = true;
      }

      if (oldProps.images[i] && this.props.images[i] && oldProps.images[i].src !== this.props.images[i].src) {
        imagesChanged = true;
      }
    }

    if (imagesChanged) {
      this.updateSrcTextures(this.props.images);
    }

    if (oldProps.backgroundImage !== this.props.backgroundImage) {
      this.updateBackgroundTexture();
    }
  }

  updateBackgroundTexture() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl');

    this.bgTexture = renderer.loadTexture(gl, this.props.backgroundImage)
  }

  updateSrcTextures(images) {
    images = images.filter((image) => image != null);
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

    var darkPreviewCtx = document.querySelector('#darkPreview').getContext("2d");
    darkPreviewCtx.clearRect(0, 0, 160, 160);
    darkPreviewCtx.drawImage(document.querySelector('#glcanvas'), 0, 0);

    this.rafHandle = raf(this.renderGlScene.bind(this, gl, programs));
  }

  saveClicked = () => {
    const canvas = document.querySelector('#glcanvas');
    canvas.toBlob((blob) => {
      saveAs(blob, this.props.saveAsName + ".png");
    });
  }

  copyClicked = () => {
    const canvas = document.querySelector('#glcanvas');

    canvas.toBlob((blob) => {
      // eslint-disable-next-line no-undef
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
    });
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <canvas id="glcanvas" width="160" height="160" onContextMenu={(e) => e.preventDefault()} />
          <canvas id="darkPreview" width="160" height="160" onContextMenu={(e) => e.preventDefault()} style={{ backgroundColor: 'black' }} />
        </div>
        <button onClick={this.saveClicked} style={{ width: "50%" }}>Save</button>
        <button onClick={this.copyClicked} style={{ width: "50%" }}>Copy</button>
      </div>
    );
  }
}