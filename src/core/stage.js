'use strict';

plexi.module('Stage', function (define) {

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;

  };

  Stage.prototype.init = function (game) {
    this.config.bodies.forEach(function (body) {
      game.current.World.addBody(body.type, body);

    });
  };

  var dispatch = {};

  return define(Stage, dispatch);
});
