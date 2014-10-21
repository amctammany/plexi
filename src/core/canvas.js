'use strict';

plexi.module('Canvas', function (define) {

  var _private = {
    drawMethods: {},

  };
  var Canvas = function (id, config) {
    this.id = id;
    this.constants = {};

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


  Canvas.prototype.init = function () {
    this.$canvas = document.getElementById(this.constants.element);
    this.ctx = this.$canvas.getContext('2d');
    var types = plexi.module('BodyType').children();
    types.forEach(function (t) {
      _private.drawMethods[t.id] = t.draw.bind(t);
    });
    return this;
  };

  Canvas.prototype.draw = function (world) {
    var ctx = this.ctx;
    world.bodies.forEach(function (body) {
      _private.drawMethods[body.type](ctx, body);
    });

  };

  var dispatch = {};

  return define(Canvas, dispatch);
});
