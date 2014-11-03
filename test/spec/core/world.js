'use strict';

describe('plexi::World', function () {
  var World, Hero, w, stage;
  var stageConfig = {
    bodies: [
      {type: 'button', x: 10, y: 10, width: 50, height: 25, text: 'click me', action: ['Console', 'log', 'foobar']},
      {type: 'button', x: 10, y: 50, width: 50, height: 25,  text: 'click me', action: ['Console', 'log', 'foobar']},
    ]
  };

  beforeEach(function () {
    plexi.clone();
    World = plexi.module('World');
    Hero = plexi.module('BodyType').create('hero', {x: 10, y: 20});
    w = World.create('main', {damping: 0.01, gravity: 1.0});
    World.change('main');
    stage = plexi.module('Stage').create('stage', stageConfig);
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

  it('should load stage', function () {
    plexi.module('BodyType').create('button', {behaviors: ['Button']});
    expect(w.bodies.length).toBe(0);
    w.load(stage.init());
    expect(w.bodies.length).toBe(stage.bodies.length);
  });
  //it('should select body via dispatch', function () {
    //var body = w.addBody('hero', {x: 100, y:100, radius: 10, fill: 'red'});
    //var selected = World.dispatch(['select', 100, 100]);

    //expect(selected).toBe(body);
  //});
});
