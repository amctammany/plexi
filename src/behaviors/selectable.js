'use strict';

plexi.behavior('Selectable', function (define) {
  var Selectable = function () {
    this.addProps(['selectAction']);
  };


  Selectable.prototype.select = function (body) {
    var action = this.prop(body, 'selectAction');
    var fn = action[0];
    this[fn].apply(this, [body].concat(action.slice(1)));
    //plexi.publish(this.prop(body, 'selectAction'));
  };

  return define(Selectable);
});
