'use strict';

/**
 * @module plexi
 */
var plexi = (function () {

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
        this._children = {};
        //Object.keys(this.children).forEach(function (c) {
          //this.children[c].reset();
        //}).bind(this);
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
      this.modules().forEach(function (m) {if (m.hasOwnProperty('reset')) {m.reset.call(m);}});
    },

    load: function (config) {
      Object.keys(config).forEach(function (key) {
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
      game.current.Canvas = game.current.Canvas || plexi.module('Canvas').children()[0];
      if (game.current.Canvas.init) {
        game.current.Canvas.init();
      }
      //game.current.Canvas.init();
      game.current.World = game.current.World || plexi.module('World').children()[0];
      if (game.current.World.init) {
        game.current.World.init();
      }
      game.current.Stage = game.current.Stage || plexi.module('Stage').children()[0];
      if (game.current.Stage.init) {
        game.current.Stage.init(game);
      }

      game.start();
      console.log(game);

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
    body.bodytype = this.id;
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


  Canvas.prototype.init = function () {
    this.$canvas = document.getElementById(this.constants.element);
    this.ctx = this.$canvas.getContext('2d');
    var types = plexi.module('BodyType').children();
    types.forEach(function (t) {
      _private.drawMethods[t.id] = t.draw.bind(t);
    });
  };

  Canvas.prototype.draw = function (world) {
    var ctx = this.ctx;
    world.bodies.forEach(function (body) {
      _private.drawMethods[body.bodytype](ctx, body);
    });

  };

  var dispatch = {};

  return define(Canvas, dispatch);
});

'use strict';

plexi.module('Game', function (define) {
  var _private = {
    current: function (config) {
      var module, instance;
      Object.keys(config).forEach(function (key) {
        module = plexi.module(key);
        if (module) {
          instance = module.get(config[key]);
          this.current[key] = instance;
          return instance;
        }
      }.bind(this));
    }

  };
  var Game = function (id, config) {
    this.id = id;
    this.constants = {};
    this.current = {};
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
    //this.current.Stage.bodies.forEach(this.current.World.addBody);
    _private.paused = false;
    _animFn = this.animate.bind(this);
  };
  Game.prototype.animate = function () {
    this.advance(0.03);
    _animLoop = window.requestAnimationFrame(_animFn);
  };
  Game.prototype.advance = function (delta) {
    this.current.Canvas.draw(this.current.World);

  };

  Game.prototype.reset = function () {
    console.log('reset game: ' + this);
  };

  var dispatch = {


  };

  return define(Game, dispatch);
});

'use strict';

plexi.module('Mouse', function (define) {

  var Mouse = function (events) {
    this.events = {

    };
  };

  var dispatch = {};

  return define(Mouse, dispatch);
});

'use strict';

plexi.module('Stage', function (define) {

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;

  };

  Stage.prototype.init = function (game) {
    this.config.bodies.forEach(function (body) {
      game.current.World.addBody(body.type, body);

    });
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

    this.bodies = [];
    this.forces = [];

  };

  World.prototype.addBody = function (bodytype, config) {
    var body = plexi.module('BodyType').get(bodytype).createBody(config);
    this.bodies.push(body);
    return body;
  };

  World.prototype.reset = function () {
    console.log('reset world: ' + this);
    //this.bodies = [];
    //this.forces = [];
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
