'use strict';

plexi.module('Keyboard', function (define) {
  var Keyboard = function (id, config) {
    this.id = id;
    this.keys = config.keys;

  };

  Keyboard.prototype.reset = function () {

  };

  var dispatch = {
    'key': function (key) {
      var event = this.keys[key];
      if (event) {
        plexi.publish(event);
        return event;
      }
    }
  };

  return define(Keyboard, dispatch);

});
