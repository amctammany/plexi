'use strict';

describe('plexi::Level', function () {
  var Level, l1, l2;

  beforeEach(function() {
    plexi.reset();
    Level = plexi.module('Level');
    l1 = Level.create('l1', {
      bodies: [
        {type: 'hero', x: 100, y: 100},
        {type: 'enemy', x: 200, y: 100},
        {type: 'enemy', x: 150, y: 140},
        {type: 'enemy', x: 100, y: 200},
      ]
    });
  });

  it('should be true', function () {
    expect(!!Level).toBe(true);
    expect(!!l1).toBe(true);
  });

  it('should init from config', function () {
    expect(l1.bodies.length).toBe(0);
    l1.init();
    expect(l1.bodies.length).toBe(4);
  });

  it('should reset itself if dirty', function () {
    expect(l1.dirty).toBe(true);
    l1.reset();
    expect(l1.dirty).toBe(false);
  });
  it('should return false if already initialized', function () {
    l1.dirty = false;
    expect(!!l1.init()).toBe(false);
  });

});
