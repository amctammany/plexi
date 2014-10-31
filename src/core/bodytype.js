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
    body.bodytype = this.id;
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

  //BodyType.prototype.reset = function () {
    //console.log('reset bodytype: ' + this.id);
  //};

  var dispatch = {

  };

  return define(BodyType, dispatch);

});
