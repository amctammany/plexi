'use strict';

plexi.module('Behavior', function (define) {
  var _private = {

  };

  var Behavior = function (id, constructor) {
    this.id = id;
    this.constructor = constructor;
  };

  Behavior.prototype.applyTo = function (instance) {
    if (!instance) {return;}
    this.constructor.call(instance);
    Object.keys(this.constructor.prototype).forEach(function (key) {
      instance[key] = this.constructor.prototype[key];
    }.bind(this));
  };

  var dispatch = {};

  return define(Behavior, dispatch);
});
