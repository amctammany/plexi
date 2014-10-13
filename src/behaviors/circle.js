'use strict';

plexi.behavior('Circle', function (define) {
  var Circle = function () {
    this.addProps(['x', 'y', 'radius', 'fill']);
  };

  Circle.prototype = {

    draw: function (ctx, body) {
      ctx.fillStyle = body.fill;
      this.createPath(ctx, body);
      ctx.fill();
    },
    createPath: function (ctx, body) {
      ctx.beginPath();
      ctx.arc(body.x, body.y, 20, 0, 6.28, 0);
      ctx.closePath();
    },

  };

  return define(Circle);

});
