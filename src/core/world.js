'use strict';

plexi.module('World', function (define) {
  var _private = {
    damping: function (v) {
      this.damping = v;
    },

  };

  var World = function (id, config) {
    this.id = id;
    this.constants = {};
    Object.keys(config).forEach(function (key) {
      if (_private.hasOwnProperty(key) && _private[key] instanceof Function) {
        _private[key].call(this, config[key]);
      } else {
        this.constants[key] = config[key];
      }
    }.bind(this));

    //this.reset();


  };

  World.prototype.addBody = function (bodytype, config) {
    var body = plexi.module('BodyType').get(bodytype).createBody(config);
    this.bodies.push(body);
    return body;
  };

  World.prototype.loadStage = function (stage) {
    //var s = plexi.module('Stage').get(stage);
    stage.bodies.forEach(function (b) {
      this.addBody(b.type, b.config);
    }.bind(this));
  };

  World.prototype.init = function () {
    this.bodies = [];
    this.forces = [];
    return this;
  };

  World.prototype.reset = function () {
    console.log('reset world: ' + this);
    this.bodies = [];
    this.forces = [];
  };

  var dispatch = {

  };

  return define(World, dispatch);


});
