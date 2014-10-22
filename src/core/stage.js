'use strict';

plexi.module('Stage', function (define) {

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;

    this.dirty = true;

  };

  Stage.prototype.init = function () {
    if (!this.dirty) {return;}
    this.bodies = this.config.bodies.map(function (body) {
      return {type: body.type, config: body};
    });
    return this;
  };

  Stage.prototype.reset = function () {
    this.init();
    this.dirty = false;

  };

  var dispatch = {};

  return define(Stage, dispatch);
});
