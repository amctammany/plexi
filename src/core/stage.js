'use strict';

plexi.module('Stage', function (define) {

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;
    this.bodies = [];

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

  Stage.prototype.loadLevel = function (level) {
    level.init();
    plexi.module('World').current().load(level);
  };

  var dispatch = {
    change: function (id) {
      this.reset();
      plexi.publish(['World', 'reset']);
      plexi.publish(['Game', 'refresh']);
    },
    loadLevel: function (id) {
      var level = plexi.module('Level').get(id);
      if (level) {
        level.init();
        this.loadLevel(level);
      }
    },
  };

  return define(Stage, dispatch);
});
