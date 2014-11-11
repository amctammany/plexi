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
    i.prop = function (body, key) {
      if (body.hasOwnProperty(key)) {
        return body[key];
      } else if (i.hasOwnProperty(key)) {
        return i[key];
      } else if (i.constants.hasOwnProperty(key)) {
        return i.constants[key];
      } else {
        console.log('invalid property name: ' + key + ' called on: ' + body.type);
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
    var module = {
      _children: {},
      _current: void 0,
      current: function () {
        return module._current || module._children[Object.keys(module._children)[0]];
      },
      change: function (id) {
        if (!module._children.hasOwnProperty(id)) { return; }
        module._current = module._children[id];
        return module._current;
      },
      dispatch: function (args) {
        args = args.slice();
        var n = args.shift();
        if (n === 'change') {
          module.change(args[0]);
          //return;
        }
        //console.log(dispatch);
        if (dispatch.hasOwnProperty(n)) {
          return dispatch[n].apply(module._current, args);
        }
      },
      children: function () {
        return Object.keys(module._children).map(function (c) { return module._children[c]; });
      },
      create: function (id, config) {
        var i = new Instance(id, config);
        decorateInstance(i);
        applyBehaviors(i);
        cleanInstance(i);
        module._children[id] = i;
        i.valid = (i.ivars.length > 0) ? false : true;
        return i;
      },
      get: function (id) {
        return (module._children[id] || void 0);
      },
      reset: function () {
        //this._children = {};
        //Object.keys(this._children).forEach(function (c) {
          //if (this._children[c].hasOwnProperty('reset')) {
            //this._children[c].reset();
          //}
        //}.bind(this));
        module._children = {};
      },
      length: function () {
        return Object.keys(module._children).length;
      }
    };
    return module;
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

    //loadLevels: function (levels) {
      //var Level = _modules.Level;
      //Object.keys(levels).forEach(function (level) {
        //Level.create(level, levels[level]);
      //});
    //},

    bootstrap: function (id) {
      var game = plexi.module('Game').change(id);
      ['Canvas', 'World', 'Stage', 'Mouse', 'Keyboard'].forEach(function (s) {
        var module = plexi.module(s);
        module.change(game.defaults[s]).reset();
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
      this.states = config;

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

  //Body.prototype.prop = function (p) {
    //if (this.hasOwnProperty(p)) {
      //return this[p];
    //} else if (false) {

    //}
  //};
  BodyType.prototype.createBody = function (config) {
    var body = new Body();
    body.type = this.id;
    Object.keys(config).forEach(function (key) {
      body[key] = config[key];
    });
    if (body.state) {
      this.changeState(body, body.state);
    }
    if (this.hasOwnProperty('isPointInPath')) {
      body.isPointInPath = this.isPointInPath.bind(this);
    }

    return body;
  };

  BodyType.prototype.changeState = function (body, state) {
    var s = this.states[state];
    if (s) {
      s.forEach(function (a) {
        body[a[0]] = a[1];
      });
      body.state = state;
    }
  };
  BodyType.prototype.toggleState = function (body, state) {
    if (body.state === state) {
      state = 'default';
    }
    this.changeState(body, state);
  };

  //BodyType.prototype.reset = function () {
    //console.log('reset bodytype: ' + this.id);
  //};

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
    this.$canvas.width = this.constants.width;
    this.$canvas.height = this.constants.height;
    this.ctx = this.$canvas.getContext('2d');
    this.width = this.$canvas.width;
    this.height = this.$canvas.height;
    this.$canvas.onmousedown = function (e) {
      this.focus();
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mousedown', pos.x, pos.y]);
    };
    this.$canvas.onmouseup = function (e) {
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mouseup', pos.x, pos.y]);
    };

    this.$canvas.onkeydown = function (e) {
      var key = String.fromCharCode(e.keyCode);
      plexi.publish(['Keyboard', 'key', key]);
      return true;
    };

    var types = plexi.module('BodyType').children();
    types.forEach(function (t) {
      _private.drawMethods[t.id] = t.draw.bind(t);
    });
    this.dirty = false;
    return this;
  };

  Canvas.prototype.draw = function (world) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
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

      //this.defaults = this.defaults || {};
      //var module, instance;
      //Object.keys(config).forEach(function (key) {
        //module = plexi.module(key);
        //if (module) {
          //instance = module.get(config[key]);
          //if (instance) {
            //this.defaults[key] = instance;
            //return instance;
          //} else {
            //this.defaults[key] = config[key];
          //}
        //} else {
          //this.defaults[key] = config[key];
          //return config[key];
        //}
      //}.bind(this));
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
    _world.load(_stage);
    this.start();
  };

  Game.prototype.reset = function () {
    Object.keys(this.defaults).forEach(function (d) {
      //plexi.publish([d, 'reset']);
    });
    console.log('reset game: ' + this);
  };

  var dispatch = {
    refresh: function () {
      this.refresh();
    },


  };

  return define(Game, dispatch);
});

'use strict';

plexi.module('Keyboard', function (define) {
  var Keyboard = function (id, config) {
    this.id = id;
    this.keys = config.keys;

  };

  Keyboard.prototype.reset = function () {

  };

  var dispatch = {
    'key': function (key) {
      var event = this.keys[key];
      if (event) {
        console.log(event);
        plexi.publish(event);
        return event;
      }
    }
  };

  return define(Keyboard, dispatch);

});

'use strict';

plexi.module('Level', function (define) {
  var Level = function (id, config) {
    this.id = id;
    this.config = config;
    this.bodies = [];
    this.dirty = true;
  };

  Level.prototype.init = function () {
    if (!this.dirty) {return false;}
    this.bodies = this.config.bodies.map(function (body) {
      return {type: body.type, config: body};
    });
    return this;
  };

  Level.prototype.reset = function () {
    this.init();
    this.dirty = false;
  };

  var dispatch = {
    change: function (id) {
      this.reset();
      plexi.publish(['Stage', 'loadLevel', id]);
    },
  };

  return define(Level, dispatch);

});

'use strict';

plexi.module('Mouse', function (define) {

  function parseEvent (event, vars) {
    return event.map(function (c) {
      if (c[0] === '@') {
        return vars[c.slice(1)];
      } else {
        return c;
      }
    });
  }
  var Mouse = function (id, config) {
    this.id = id;
    this.events = config.events;
  };

  Mouse.prototype.reset = function () {

  };


  var dispatch = {
    'event': function (e, x, y) {
      var event = this.events[e];
      var vars = {x: x, y: y};
      if (event) {
        plexi.publish(parseEvent(event, vars));
      }
      return event;

    },
  };

  return define(Mouse, dispatch);
});

'use strict';

plexi.module('Stage', function (define) {

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;
    this.bodies = [];

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

  Stage.prototype.loadLevel = function (level) {
    level.init();
    plexi.module('World').current().load(level);
  };

  var dispatch = {
    change: function (id) {
      this.reset();
      plexi.publish(['World', 'reset']);
      plexi.publish(['Game', 'refresh']);
    },
    loadLevel: function (id) {
      var level = plexi.module('Level').get(id);
      if (level) {
        level.init();
        this.loadLevel(level);
      }
    },
  };

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

'use strict';

plexi.behavior('Button', function (define) {
  var Button = function () {
    this.addProps(['x', 'y', 'width', 'text', 'action', 'fill', 'textColor', 'padding']);
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
      var w = this.prop(body, 'width');
      var h = this.prop(body, 'height');
      var x = this.prop(body, 'x');
      var y = this.prop(body, 'y');
      ctx.font = '20px Arial';
      var width = ctx.measureText(text).width;
      ctx.beginPath();
      ctx.fillText(text, x + (padding + w - width) / 2, y + 10 + h / 2);
      ctx.closePath();

    },

    createPath: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      ctx.font = '20px Arial';
      var width = this.prop(body, 'width') || ctx.measureText(this.prop(body, 'text')).width;
      var height = this.prop(body, 'height') || 20;
      ctx.beginPath();
      ctx.rect(this.prop(body, 'x'), this.prop(body, 'y'), width + padding, height + padding);
      ctx.closePath();
      //ctx.text(body.x + (width / 2), body.y, this.prop('text'));
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

    select: function (body) {
      plexi.publish(this.prop(body, 'action'));
    },

  };

  return define(Button);
});

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

    //select: function (body) {
      //var state = body.state === 'selected' ? 'default' : 'selected';
      //this.changeState(body, state);
      ////body.fill = 'red';
    //},

  };

  return define(Circle);

});

'use strict';

plexi.behavior('Group', function (define) {

  var Group = function () {
    this.addProps(['template', 'group', 'rows', 'columns', 'x', 'y', 'width', 'height', 'padding']);

  };

  Group.prototype = {
    init: function (body) {
      var prop = function (key) {return this.prop(body, key);}.bind(this);
      body.itemWidth = (prop('width') - (prop('padding') * (prop('columns') + 1))) / prop('columns');
      body.itemHeight = (prop('height') - (prop('padding') * (prop('rows') + 1))) / prop('rows');
      body.tId = prop('template');
      var template = plexi.module('BodyType').get(body.tId);
      var group = prop('group');
      body.members = group.map(function (item) {
        var i = group.indexOf(item);
        var row = Math.floor(i / prop('columns'));
        var column = i % prop('columns');
        item.x = prop('x') + prop('padding') + (prop('padding') + body.itemWidth) * column;
        item.y = prop('y') + prop('padding') + (prop('padding') + body.itemHeight) * row;
        item.width = body.itemWidth - prop('padding');
        item.height = body.itemHeight - prop('padding');
        var b = template.createBody(item);
        return b;
      });
      body.initialized = true;

    },
    draw: function (ctx, body) {
      if (!body.initialized) {this.init(body);}
      var template = plexi.module('BodyType').get(body.tId);
      ctx.fillStyle = 'blue';
      ctx.fillRect(this.prop(body, 'x'), this.prop(body, 'y'), this.prop(body, 'width'), this.prop(body, 'height'));
      //body.members.forEach(function (b) {
        //template.draw(ctx, b);
      //});
    },

    createPath: function (ctx, body) {
      var prop = function (key) {return this.prop(body, key);}.bind(this);
      if (!body.initialized) {this.init(body);}
      ctx.beginPath();
      ctx.rect(prop('x'), prop('y'), prop('width'), prop('height'));
      ctx.closePath();
    },

    //isPointInPath: function (ctx, body, x, y) {
      //this.createPath(ctx, body);
      //return ctx.isPointInPath(x, y);
    //},

  };

  return define(Group);

});

'use strict';

plexi.behavior('Particle', function (define) {
  var Particle = function () {
    this.addProps(['x', 'y', 'mass', 'velocity', 'acceleration', 'forceAccumulator']);
  };

  return define(Particle);
});

'use strict';

plexi.behavior('Rectangle', function (define) {
  var Rectangle = function () {
    this.addProps(['x', 'y', 'width', 'height', 'fill']);
  };

  Rectangle.prototype = {

    draw: function (ctx, body) {
      ctx.fillStyle = this.prop(body, 'fill');
      ctx.strokeStyle = this.prop(body, 'stroke');
      this.createPath(ctx, body);
      ctx.fill();
      ctx.stroke();
    },

    createPath: function (ctx, body) {
      ctx.beginPath();
      ctx.rect(this.prop(body, 'x'), this.prop(body, 'y'), this.prop(body, 'width'), this.prop(body, 'height'));
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },


  };

  return define(Rectangle);

});

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
