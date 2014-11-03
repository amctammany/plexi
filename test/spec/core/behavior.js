'use strict';

describe('plexi::Behavior', function () {
  var Behavior, Hero, Circle;
  beforeEach(function () {
    //plexi = plexi.clone();
    Behavior = plexi.module('Behavior');
    Circle = plexi.behavior('Circle');
    Hero = plexi.module('BodyType').create('hero', {behaviors: ['Circle'], x: 10, y: 20, radius: 10, fill: 'blue'});
    //Circle = plexi.behavior('Circle');
    //Rectangle = plexi.behavior('Rectangle');


  });

  it('should be true', function () {
    expect(!!Behavior).toBe(true);
  });

  it('should have same methods as behavior', function () {
    var proto = Circle.constructor.prototype;
    Object.keys(proto).forEach(function (method) {
      expect(Hero[method]).toBe(proto[method]);
    });
  });

});
