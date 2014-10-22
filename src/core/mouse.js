'use strict';

plexi.module('Mouse', function (define) {
  var Mouse = function (id, config) {
    this.id = id;
    this.events = config.events;
  };

  Mouse.prototype.reset = function () {

  };


  var dispatch = {
    'event': function (e, x, y) {
      var event = this.events[e];
      if (event) {
        plexi.publish(event);
      }

    },
  };

  return define(Mouse, dispatch);
});
