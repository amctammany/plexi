'use strict';

plexi.behavior('Circle', function (define) {
  var Circle = function () {
    this.addProps(['x', 'y', 'radius', 'fill']);
  };

  Circle.prototype = {

    draw: function (ctx, body) {
      ctx.fillStyle = this.prop(body, 'fill');
      this.createPath(ctx, body);
      ctx.fill();
    },
    createPath: function (ctx, body) {
      ctx.beginPath();
      ctx.arc(this.prop(body, 'x'), this.prop(body, 'y'), 20, 0, 6.28, 0);
      ctx.closePath();
    },

  };

  return define(Circle);

});
