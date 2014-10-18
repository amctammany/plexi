'use strict';

plexi.module('Game', function (define) {
  var _private = {
    current: function (config) {
      var module, instance;
      Object.keys(config).forEach(function (key) {
        module = plexi.module(key);
        if (module) {
          instance = module.get(config[key]);
          this.current[key] = instance;
          return instance;
        }
      }.bind(this));
    }

  };
  var Game = function (id, config) {
    this.id = id;
    this.constants = {};
    this.current = {};
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
    //this.current.Stage.bodies.forEach(this.current.World.addBody);
    _private.paused = false;
    _animFn = this.animate.bind(this);
    _animFn();
  };
  Game.prototype.animate = function () {
    this.advance(0.03);
    _animLoop = window.requestAnimationFrame(_animFn);
  };
  Game.prototype.advance = function (delta) {
    this.current.Canvas.draw(this.current.World);
  };
  Game.prototype.refresh = function () {
    if (_animLoop) {
      window.cancelAnimationFrame(_animLoop);
    }
    this.current.World.reset();
    this.current.Stage.reset();
    this.current.World.loadStage(this.current.Stage.id);
    this.start();
  };

  Game.prototype.reset = function () {
    console.log('reset game: ' + this);
  };

  var dispatch = {


  };

  return define(Game, dispatch);
});
