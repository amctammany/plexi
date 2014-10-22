'use strict';

/**
 * @module plexi
 */
var plexi = (function () {

  var _config;
  var _modules = {};
  var _behaviors = {};
  var _dispatch = {};
  var _constants = {};
  var _private = {

  };

  function decorateInstance(i) {
    if (!i) {return;}
    i.properties = i.properties || [];
    i.addProps = function (arr) {
      //console.log(this);
      arr.forEach(function (p) {
        if (i.properties.indexOf(p) < 0) {
          i.properties.push(p);
        }
      });
    };
    i.prop = function (key) {
      if (i.hasOwnProperty(key)) {
        return i[key];
      } else if (i.constants.hasOwnProperty(key)) {
        return i.constants[key];
      } else {
        console.log('invalid property name');
        return;
      }
    };
  }

  function applyBehaviors(i) {
    //if (!i) {return;}
    //console.log(i);
    var Behavior = plexi.module('Behavior');
    var bhvr;
    if (i.hasOwnProperty('constants') && i.constants.hasOwnProperty('behaviors')) {
      i.constants.behaviors.forEach(function (b) {
        bhvr = Behavior.get(b);
        //console.log(bhvr);
        if (bhvr) {
          bhvr.applyTo(i);
        }
      });
    }
  }
  function cleanInstance(i) {
    i.ivars = i.properties.filter(function (p) {
      return !i.constants.hasOwnProperty(p);
    });
  }

  function defineMixin (Instance) {
    //console.log(Instance.prototype);
    return Instance;
    //return (function () {
      //return Instance;
    //})()
    //return Instance;
    //return {
      //applyTo: function (klass) {
        //console.log(klass);
        //Instance.call(klass);
        //Object.keys(Instance.prototype).forEach(function (key) {
          //if (!klass.prototype[key]) {
            //klass.prototype[key] = Instance.prototype[key];
          //}
        //});
      //},
    //};
  }


  /**
   * @function defineModule
   * @param {Function} Instance - Constructor Function
   * @param {Object} dispatch - Public events
   * @memberof plexi
   *
   */
  function defineModule(Instance, dispatch) {
    return {
      _children: {},
      _current: void 0,
      current: function () {
        return this._current;
      },
      use: function (id) {
        this._current = this._children[id];
        return this._current;
      },
      dispatch: function (args) {
        args = args.slice();
        var n = args.shift();
        //console.log(dispatch);
        if (dispatch.hasOwnProperty(n)) {
          dispatch[n].apply(null, args);
        }
      },
      children: function () {
        return Object.keys(this._children).map(function (c) { return this._children[c]; }.bind(this));
      },
      create: function (id, config) {
        var i = new Instance(id, config);
        decorateInstance(i);
        applyBehaviors(i);
        cleanInstance(i);
        this._children[id] = i;
        i.valid = (i.ivars.length > 0) ? false : true;
        return i;
      },
      get: function (id) {
        return (this._children[id] || void 0);
      },
      reset: function () {
        //this._children = {};
        //Object.keys(this._children).forEach(function (c) {
          //if (this._children[c].hasOwnProperty('reset')) {
            //this._children[c].reset();
          //}
        //}.bind(this));
        this._children = {};
      },
      length: function () {
        return Object.keys(this._children).length;
      }
    };
  }

  // Plexi Interface
  return {
    module: function (id, cb) {
      if (cb === void 0) {
        if (_modules[id]) {
          return _modules[id];
        } else {
          console.warn('Invalid module selected: ' + id);
        }

       } else if (typeof cb === 'function') {
         var module = cb(defineModule);
         module.id = id;
         module.token = plexi.dispatch.subscribe(id, module.dispatch);
         _modules[id] = module;
         return _modules[id];
       } else {
        console.warn('Invalid callback declared for module: ' + id);
       }
    },

    modules: function () {
      return Object.keys(_modules).map(function (key) {
        if (_modules.hasOwnProperty(key)) {
          return _modules[key];
        }
      });
    },
    moduleNames: function () {
      return Object.keys(_modules);
    },

    behavior: function (id, mixin) {
      var Behavior = plexi.module('Behavior');
      if (mixin === void 0) {
        if (_behaviors[id]) {
          return _behaviors[id];
        } else {
          console.warn('Invalid behavior selected: ' + id);
        }
      } else if (typeof mixin === 'function') {
        var behavior = Behavior.create(id, mixin(defineMixin));
        behavior.id = id;
        _behaviors[id] = behavior;
        return _behaviors[id];
      } else {
        console.warn('Invalid mixin declared for behavior: ' + id);
      }
      //return plexi.module('Behavior').create(id, mixin(defineMixin));
    },
    reset: function () {
      //if (!!_config) {
        //this.load(_config);
      //}
      //_modules = {};
      this.modules().forEach(function (m) {if (m.hasOwnProperty('reset')) {m.reset.call(m);}});
    },

    dispatch: (function (obj) {
      var channels = {};
      var uid = -1;

      obj.publish = function (args) {
        args = args.slice();
        var channel = args.shift();
        if (!channels[channel]) {
          return false;
        }
        var subscribers = channels[channel],
            l = subscribers ? subscribers.length : 0;
        while(l--) {
          subscribers[l].func(args);
        }
      };

      obj.subscribe = function (channel, func) {
        if (!channels[channel]) {
          channels[channel] = [];
        }
        var token = (++uid).toString();
        channels[channel].push({
          token: token,
          func: func,
        });
        return token;
      };

      obj.unsubscribe = function (token) {
        for (var c in channels) {
          if (channels[c]) {
            for (var i = 0, j = channels[c].length; i < j; i++){
              if (channels[c][i].token === token) {
                channels[c].splice(i, 1);
                return token;
              }
            }
          }
        }
        return this;
      };

      obj.reset = function () {
        channels = {};
        uid = -1;
      };

      obj.length = function () {
        return Object.keys(channels).length;
      };
      return obj;
    })(_dispatch),
    publish: function (args) {
      if (args[0] instanceof Array) {
        args.forEach(function (a) {
          plexi.dispatch.publish(a);
        });
      } else {
        return plexi.dispatch.publish(args);
      }
    },
    subscribe: function (channel, func) {
      return plexi.dispatch.subscribe(channel, func);
    },
    unsubscribe: function (token) {
      return plexi.dispatch.unsubscribe(token);
    },

    load: function (config) {
      if (_config !== config) {
        _config = config;
      }
      Object.keys(_config).forEach(function (key) {
        if (_modules.hasOwnProperty(key)) {
          Object.keys(config[key]).forEach(function (mod) {
            _modules[key].create(mod, config[key][mod]);
          });
        } else {
          _constants[key] = config[key];
        }
      });
    },

    loadLevels: function (levels) {
      var Level = _modules.Level;
      Object.keys(levels).forEach(function (level) {
        Level.create(level, levels[level]);
      });
    },

    bootstrap: function (id) {
      var game = plexi.module('Game').get(id);
      ['Canvas', 'World', 'Stage'].forEach(function (s) {
        var module = plexi.module(s);
        module.use(game.defaults[s]).reset();
      });

      game.refresh();
      //console.log(game);

    },

    clone: function () {
      this.reset();
      return Object.create(plexi);
    },

  };
})();

'use strict';

plexi.module('Behavior', function (define) {
  var _private = {

  };

  var Behavior = function (id, constructor) {
    this.id = id;
    this.constructor = constructor;
  };

  Behavior.prototype.applyTo = function (instance) {
    if (!instance) {return;}
    this.constructor.call(instance);
    Object.keys(this.constructor.prototype).forEach(function (key) {
      instance[key] = this.constructor.prototype[key];
    }.bind(this));
  };

  var dispatch = {};

  return define(Behavior, dispatch);
});

'use strict';
/**
 * @module BodyType
 */

plexi.module('BodyType', function (define) {
  var _private = {
    /**
     * @function
     * @param {Object} config Configuration Object
     * @memberof BodyType
     */
    states: function (config) {
      this.statuses = Object.keys(config);

      //console.log(config);
    },

  };

  /**
   * BodyType
   * @class BodyType
   * @constructor
   * @param {String} id Identifier foobar
   * @param {Object} config Configuration object
   * @memberof BodyType
   */

  var BodyType = function (id, config) {
    this.id = id;
    this.constants = {};
    this.methods = [];
    this.proto = {};
    Object.keys(config).forEach(function (key) {
      if (_private.hasOwnProperty(key) && _private[key] instanceof Function) {
        _private[key].call(this, config[key]);
      } else {
        this.constants[key] = config[key];
      }
    }.bind(this));

  };
  var Body = function () {

  };

  BodyType.prototype.createBody = function (config) {
    var body = new Body();
    //body.bodytype = this.id;
    Object.keys(config).forEach(function (key) {
      body[key] = config[key];
    });

    return body;

  };

  BodyType.prototype.reset = function () {
    console.log('reset bodytype: ' + this.id);
  };

  var dispatch = {

  };

  return define(BodyType, dispatch);

});

'use strict';

plexi.module('Canvas', function (define) {

  var _private = {
    drawMethods: {},

  };
  var Canvas = function (id, config) {
    this.id = id;
    this.constants = {};

    this.dirty = true;

    this.properties = ['element', 'width', 'height'];

    this.$canvas = void 0;
    this.ctx = void 0;

    Object.keys(config).forEach(function (key) {
      if (_private.hasOwnProperty(key) && _private[key] instanceof Function) {
        _private[key].call(this, config[key]);
      } else {
        this.constants[key] = config[key];
      }
    }.bind(this));
  };


  function getMousePosition(e) {
    return {
      x: e.offsetX,
      y: e.offsetY,
    };
  }

  Canvas.prototype.init = function () {
    if (!this.dirty) {return;}
    this.$canvas = document.getElementById(this.constants.element);
    this.$canvas.onmousedown = function (e) {
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mousedown', pos.x, pos.y]);
    };
    this.ctx = this.$canvas.getContext('2d');
    var types = plexi.module('BodyType').children();
    types.forEach(function (t) {
      _private.drawMethods[t.id] = t.draw.bind(t);
    });
    this.dirty = false;
    return this;
  };

  Canvas.prototype.draw = function (world) {
    var ctx = this.ctx;
    world.bodies.forEach(function (body) {
      _private.drawMethods[body.type](ctx, body);
    });

  };

  Canvas.prototype.reset = function () {
    this.init();

  };
  var dispatch = {};

  return define(Canvas, dispatch);
});

'use strict';

plexi.module('Game', function (define) {
  var _private = {
    defaults: function (config) {
      this.defaults = config;
      return;

      this.defaults = this.defaults || {};
      var module, instance;
      Object.keys(config).forEach(function (key) {
        module = plexi.module(key);
        if (module) {
          instance = module.get(config[key]);
          if (instance) {
            this.defaults[key] = instance;
            return instance;
          } else {
            this.defaults[key] = config[key];
          }
        } else {
          this.defaults[key] = config[key];
          return config[key];
        }
      }.bind(this));
    }

  };
  var _world, _stage, _canvas;
  var Game = function (id, config) {
    this.id = id;
    this.constants = {};
    Object.keys(config).forEach(function (key) {
      if (_private.hasOwnProperty(key) && _private[key] instanceof Function) {
        _private[key].call(this, config[key]);
      } else {
        this.constants[key] = config[key];
      }
    }.bind(this));
  };

  var _animLoop, _animFn;
  Game.prototype.start = function () {
    _private.paused = false;
    _animFn = this.animate.bind(this);
    _animFn();
  };
  Game.prototype.animate = function () {
    this.advance(0.03);
    _animLoop = window.requestAnimationFrame(_animFn);
  };
  Game.prototype.advance = function (delta) {
    _canvas.draw(_world);
    //this.current.Canvas.draw(this.current.World);
  };
  Game.prototype.refresh = function () {
    if (_animLoop) {
      window.cancelAnimationFrame(_animLoop);
    }

    _world = plexi.module('World').current();
    _canvas = plexi.module('Canvas').current();
    _stage = plexi.module('Stage').current();
    _world.loadStage(_stage);
    this.start();
  };

  Game.prototype.reset = function () {
    Object.keys(this.defaults).forEach(function (d) {
      //plexi.publish([d, 'reset']);
    });
    console.log('reset game: ' + this);
  };

  var dispatch = {


  };

  return define(Game, dispatch);
});

'use strict';

plexi.module('Mouse', function (define) {
  var Mouse = function (id, events) {
    this.id = id;
    this.events = {

    };
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

'use strict';

plexi.module('Stage', function (define) {

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;

    this.dirty = true;

  };

  Stage.prototype.init = function () {
    if (!this.dirty) {return;}
    this.bodies = this.config.bodies.map(function (body) {
      return {type: body.type, config: body};
    });
    return this;
  };

  Stage.prototype.reset = function () {
    this.init();
    this.dirty = false;

  };

  var dispatch = {};

  return define(Stage, dispatch);
});

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

    //this.reset();


  };

  World.prototype.addBody = function (bodytype, config) {
    var body = plexi.module('BodyType').get(bodytype).createBody(config);
    this.bodies.push(body);
    return body;
  };

  World.prototype.loadStage = function (stage) {
    //var s = plexi.module('Stage').get(stage);
    stage.bodies.forEach(function (b) {
      this.addBody(b.type, b.config);
    }.bind(this));
  };

  World.prototype.init = function () {
    this.bodies = [];
    this.forces = [];
    return this;
  };

  World.prototype.reset = function () {
    console.log('reset world: ' + this);
    this.bodies = [];
    this.forces = [];
  };

  var dispatch = {

  };

  return define(World, dispatch);


});

'use strict';

plexi.behavior('Circle', function (define) {
  var Circle = function () {
    this.addProps(['x', 'y', 'radius', 'fill']);
  };

  Circle.prototype = {

    draw: function (ctx, body) {
      ctx.fillStyle = this.prop('fill');
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
