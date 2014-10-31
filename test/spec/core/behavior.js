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
    var h = Hero.createBody({});
    console.log(Hero.draw);
    console.log(Circle);
    expect(Hero.draw).toBe(Circle.draw);
  });

});
