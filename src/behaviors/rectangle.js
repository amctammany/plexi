'use strict';

plexi.behavior('Rectangle', function (define) {
  var Rectangle = function () {
    this.addProps(['x', 'y', 'width', 'height', 'fill']);
  };

  Rectangle.prototype = {

    draw: function (ctx) {
      console.log(ctx);
    },
  };

  return Rectangle;

});
