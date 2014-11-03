'use strict';

describe('behavior::Rectangle', function () {
  var Rectangle, Hero;

  beforeEach(function () {
    //plexi.reset();
    Rectangle = plexi.behavior('Rectangle');
    Hero = plexi.module('BodyType').create('hero', {behaviors: ['Rectangle'], x: 100, y: 150, width: 20, height: 20 });
  });

  it('should be true', function () {
    expect(!!Rectangle).toBe(true);
    expect(!!Hero).toBe(true);
  });

  it('should have select(body) method from prototype', function () {
    expect(Hero.select).toBe(Rectangle.constructor.prototype.select);
  });
});

