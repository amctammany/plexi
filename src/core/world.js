'use strict';

plexi.module('World', function (define) {
  var _private = {
    damping: function (v) {
      this.damping = v;
    },

  };

  var World = function (id, config) {
    this.id = id;
    this.constants = {};
    Object.keys(config).forEach(function (key) {
      if (_private.hasOwnProperty(key) && _private[key] instanceof Function) {
        _private[key].call(this, config[key]);
      } else {
        this.constants[key] = config[key];
      }
    }.bind(this));

    this.init();


  };

  World.prototype.addBody = function (type, config) {
    var bodytype = plexi.module('BodyType').get(type);
    var body = bodytype.createBody(config);
    var world = this;
    this.bodies.push(body);
    if (bodytype.hasOwnProperty('init')) {
      bodytype.init(body);
      if (body.members) {
        body.members.forEach(function (m) {
          this.bodies.push(m);
        }.bind(world));
      }
    }
    return body;
  };

  World.prototype.load = function (obj) {
    //this.reset();
    //var s = plexi.module('Stage').get(stage);
    obj.bodies.forEach(function (b) {
      this.addBody(b.type, b.config);
    }.bind(this));
  };

  World.prototype.init = function () {
    this.bodies = [];
    this.forces = [];
    return this;
  };

  World.prototype.reset = function () {
    this.bodies = [];
    this.forces = [];
  };

  function distance(body, x, y) {
    var d = Math.sqrt(Math.pow(body.x - x, 2) + Math.pow(body.y - y, 2));
    return d;
  }
  var dispatch = {
    reset: function () {
      //console.log('world reset via dispatch');
      this.reset();

    },
    select: function (x, y) {
      var ctx = plexi.module('Canvas').current().ctx;
      var bodies = this.bodies.filter(function (b) {
        if (b.hasOwnProperty('isPointInPath')) {
          return b.isPointInPath(ctx, b, x, y);
        }
        //return distance(b, x, y) < 20 ? true : false;
      });
      //console.log(bodies);
      var BodyType = plexi.module('BodyType');
      var type;
      bodies.forEach(function (b) {
        type = BodyType.get(b.type);
        if (!type.hasOwnProperty('select')) { return; }

        type.select(b);
      });
      //console.log('x: ' + x + '; y: ' + y);
    },

  };

  return define(World, dispatch);


});
