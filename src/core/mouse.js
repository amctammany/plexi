'use strict';

plexi.module('Mouse', function (define) {

  var Mouse = function (id, events) {
    this.id = id;
    this.events = {

    };
  };

  var dispatch = {};

  return define(Mouse, dispatch);
});
