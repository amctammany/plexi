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
        console.log(event);
        plexi.publish(event);
      }
    }
  };

  return define(Keyboard, dispatch);

});
