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
        module.use(game.defaults[s]).init();
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
