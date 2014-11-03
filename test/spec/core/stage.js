'use strict';

describe('plexi::Stage', function () {
  var Stage, s1, level, World, world;
  var s1Config = {
    bodies: [
      {type: 'button', x: 10, y: 10, width: 50, height: 25, text: 'click me', action: ['Console', 'log', 'foobar']},
      {type: 'button', x: 10, y: 50, width: 50, height: 25,  text: 'click me', action: ['Console', 'log', 'foobar']},
    ]
  };
  var levelConfig = {
    bodies: [
      {type: 'button', x: 10, y: 10, width: 50, height: 25, text: 'click me', action: ['Console', 'log', 'foobar']},
      {type: 'button', x: 10, y: 50, width: 50, height: 25,  text: 'click me', action: ['Console', 'log', 'foobar']},
    ]
  };


  beforeEach(function() {
    plexi.reset();
    plexi.module('BodyType').create('button', {behaviors: ['Button']});
    Stage = plexi.module('Stage');
    s1 = Stage.create('s1', s1Config);
    World = plexi.module('World');
    world = World.create('main', {});
    World.change('main');


    level = plexi.module('Level').create('level', levelConfig);
  });

  it('should be true', function () {
    expect(!!Stage).toBe(true);
    expect(!!s1).toBe(true);
  });
  it('should init from config', function () {
    expect(s1.bodies.length).toBe(0);
    s1.init();
    expect(s1.bodies.length).toBe(2);
  });
  it('should reset', function () {
    expect(s1.bodies.length).toBe(0);
    expect(s1.dirty).toBe(true);
    s1.reset();
    expect(s1.bodies.length).toBe(2);
    expect(s1.dirty).toBe(false);
  });
  it('should load level', function () {

    s1.init();
    world.load(s1);
    expect(world.bodies.length).toBe(2);
    s1.loadLevel(level.init());
    expect(world.bodies.length).toBe(4);
  });


});
