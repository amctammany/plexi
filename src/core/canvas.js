'use strict';

plexi.module('Canvas', function (define) {

  var _private = {
    drawMethods: {},

  };
  var Canvas = function (id, config) {
    this.id = id;
    this.constants = {};

    this.dirty = true;

    this.properties = ['element', 'width', 'height'];

    this.$canvas = void 0;
    this.ctx = void 0;

    Object.keys(config).forEach(function (key) {
      if (_private.hasOwnProperty(key) && _private[key] instanceof Function) {
        _private[key].call(this, config[key]);
      } else {
        this.constants[key] = config[key];
      }
    }.bind(this));
  };


  function getMousePosition(e) {
    return {
      x: e.offsetX,
      y: e.offsetY,
    };
  }

  Canvas.prototype.init = function () {
    if (!this.dirty) {return;}
    this.$canvas = document.getElementById(this.constants.element);
    this.$canvas.width = this.constants.width;
    this.$canvas.height = this.constants.height;
    this.ctx = this.$canvas.getContext('2d');
    this.width = this.$canvas.width;
    this.height = this.$canvas.height;
    this.$canvas.onmousedown = function (e) {
      this.focus();
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mousedown', pos.x, pos.y]);
    };
    this.$canvas.onmouseup = function (e) {
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mouseup', pos.x, pos.y]);
    };

    this.$canvas.onkeydown = function (e) {
      var key = String.fromCharCode(e.keyCode);
      plexi.publish(['Keyboard', 'key', key]);
      return true;
    };

    var types = plexi.module('BodyType').children();
    types.forEach(function (t) {
      _private.drawMethods[t.id] = t.draw.bind(t);
    });
    this.dirty = false;
    return this;
  };

  Canvas.prototype.draw = function (world) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    world.bodies.forEach(function (body) {
      _private.drawMethods[body.type](ctx, body);
    });

  };

  Canvas.prototype.reset = function () {
    this.init();

  };
  var dispatch = {};

  return define(Canvas, dispatch);
});
