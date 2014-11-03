'use strict';

plexi.module('Level', function (define) {
  var Level = function (id, config) {
    this.id = id;
    this.config = config;
    this.bodies = [];
    this.dirty = true;
  };

  Level.prototype.init = function () {
    if (!this.dirty) {return;}
    this.bodies = this.config.bodies.map(function (body) {
      return {type: body.type, config: body};
    });
    return this;
  };

  Level.prototype.reset = function () {
    this.init();
    this.dirty = false;
  };

  var dispatch = {
    change: function (id) {
      this.reset();
      plexi.publish(['Stage', 'loadLevel', id]);
    },
  };

  return define(Level, dispatch);

});
