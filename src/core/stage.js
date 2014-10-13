'use strict';

plexi.module('Stage', function (define) {

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;

  };

  Stage.prototype.init = function () {
    this.config.bodies.forEach(function (body) {
      console.log(body);

    });
  };

  var dispatch = {};

  return define(Stage, dispatch);
});
