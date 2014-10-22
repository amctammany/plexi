'use strict';

plexi.module('Mouse', function (define) {
  var Mouse = function (id, events) {
    this.id = id;
    this.events = {

    };
  };

  Mouse.prototype.reset = function () {

  };


  var dispatch = {
    'event': function (e, x, y) {
      console.log(e);
      console.log(x);
      console.log(y);

    },
  };

  return define(Mouse, dispatch);
});
