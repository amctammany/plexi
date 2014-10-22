'use strict';

plexi.behavior('Button', function (define) {
  var Button = function () {
    this.addProps(['x', 'y', 'text', 'action', 'fill', 'textColor', 'padding']);
  };

  Button.prototype = {
    draw: function (ctx, body) {
      ctx.fillStyle = this.prop(body, 'fill');
      this.createPath(ctx, body);
      ctx.fill();
      ctx.fillStyle = this.prop(body, 'textColor');
      this.drawText(ctx, body);
      ctx.fill();
    },

    drawText: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      var text = this.prop(body, 'text');
      ctx.font = '20px Arial';
      //var width = ctx.measureText(text).width;
      ctx.beginPath();
      ctx.fillText(text, this.prop(body, 'x') + padding / 2, this.prop(body, 'y') + 20);
      ctx.closePath();

    },

    createPath: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      ctx.font = '20px Arial';
      var width = ctx.measureText(this.prop(body, 'text')).width;
      ctx.beginPath();
      ctx.rect(this.prop(body, 'x'), this.prop(body, 'y'), width + padding, 20 + padding);
      ctx.closePath();
      //ctx.text(body.x + (width / 2), body.y, this.prop('text'));
    },
  };

  return define(Button);
});
