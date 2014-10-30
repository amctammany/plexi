'use strict';

plexi.behavior('Circle', function (define) {
  var Circle = function () {
    this.addProps(['x', 'y', 'radius', 'fill']);
  };

  Circle.prototype = {

    draw: function (ctx, body) {
      ctx.fillStyle = this.prop(body, 'fill');
      ctx.strokeStyle = this.prop(body, 'stroke');
      this.createPath(ctx, body);
      ctx.fill();
      ctx.stroke();
    },
    createPath: function (ctx, body) {
      ctx.beginPath();
      ctx.arc(this.prop(body, 'x'), this.prop(body, 'y'), 20, 0, 6.28, 0);
      ctx.closePath();
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

    select: function (body) {
      var state = body.state === 'selected' ? 'default' : 'selected';
      this.changeState(body, state);
      //body.fill = 'red';
    },

  };

  return define(Circle);

});
