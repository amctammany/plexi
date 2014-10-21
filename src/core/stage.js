'use strict';

plexi.module('Stage', function (define) {

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;

  };

  Stage.prototype.init = function () {
    this.bodies = this.config.bodies.map(function (body) {
      return {type: body.type, config: body};
    });
    return this;
  };

  Stage.prototype.reset = function () {

  };

  var dispatch = {};

  return define(Stage, dispatch);
});
