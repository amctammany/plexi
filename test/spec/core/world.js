'use strict';

describe('plexi::World', function () {
  var World, Hero, w;
  beforeEach(function () {
    plexi.clone();
    World = plexi.module('World');
    Hero = plexi.module('BodyType').create('hero', {x: 10, y: 20});
    w = World.create('main', {damping: 0.01, gravity: 1.0});
    World.change('main');
  });

  it('should be true', function () {
    expect(!!World).toBe(true);
  });

  it('should create World', function () {
    expect(!!w).toBe(true);
    expect(w.damping).toBe(0.01);
    expect(w.constants.gravity).toBe(1.0);
  });

  it('should add body to world', function () {
    w.addBody('hero', {x: 100, y:100, radius: 10, fill: 'red'});
    expect(w.bodies.length).toBe(1);
  });
  it('should reset world', function () {
    w.addBody('hero', {x: 100, y:100, radius: 10, fill: 'red'});
    expect(w.bodies.length).toBe(1);
    w.reset();
    expect(w.bodies.length).toBe(0);
  });

  it('should reset world via dispatch', function () {
    w.addBody('hero', {x: 100, y:100, radius: 10, fill: 'red'});
    expect(w.bodies.length).toBe(1);
    World.dispatch(['reset']);
    expect(w.bodies.length).toBe(0);
  });

  //it('should select body via dispatch', function () {
    //var body = w.addBody('hero', {x: 100, y:100, radius: 10, fill: 'red'});
    //var selected = World.dispatch(['select', 100, 100]);

    //expect(selected).toBe(body);
  //});
});
