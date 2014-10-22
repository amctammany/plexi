'use strict';

plexi.module('Game', function (define) {
  var _private = {
    defaults: function (config) {
      this.defaults = config;
      return;

      this.defaults = this.defaults || {};
      var module, instance;
      Object.keys(config).forEach(function (key) {
        module = plexi.module(key);
        if (module) {
          instance = module.get(config[key]);
          if (instance) {
            this.defaults[key] = instance;
            return instance;
          } else {
            this.defaults[key] = config[key];
          }
        } else {
          this.defaults[key] = config[key];
          return config[key];
        }
      }.bind(this));
    }

  };
  var _world, _stage, _canvas;
  var Game = function (id, config) {
    this.id = id;
    this.constants = {};
    Object.keys(config).forEach(function (key) {
      if (_private.hasOwnProperty(key) && _private[key] instanceof Function) {
        _private[key].call(this, config[key]);
      } else {
        this.constants[key] = config[key];
      }
    }.bind(this));
  };

  var _animLoop, _animFn;
  Game.prototype.start = function () {
    _private.paused = false;
    _animFn = this.animate.bind(this);
    _animFn();
  };
  Game.prototype.animate = function () {
    this.advance(0.03);
    _animLoop = window.requestAnimationFrame(_animFn);
  };
  Game.prototype.advance = function (delta) {
    _canvas.draw(_world);
    //this.current.Canvas.draw(this.current.World);
  };
  Game.prototype.refresh = function () {
    if (_animLoop) {
      window.cancelAnimationFrame(_animLoop);
    }

    _world = plexi.module('World').current();
    _canvas = plexi.module('Canvas').current();
    _stage = plexi.module('Stage').current();
    _world.loadStage(_stage);
    this.start();
  };

  Game.prototype.reset = function () {
    Object.keys(this.defaults).forEach(function (d) {
      //plexi.publish([d, 'reset']);
    });
    console.log('reset game: ' + this);
  };

  var dispatch = {


  };

  return define(Game, dispatch);
});
