'use strict';

describe('plexi::Canvas', function () {
  var Canvas;

  beforeEach(function () {
    Canvas = plexi.module('Canvas');
  });

  it('should be true', function () {
    expect(!!Canvas).toBe(true);
  });

  it('should create Canvas', function () {
    var c = Canvas.create('main', {width: 500, height: 500, element: 'canvas-element'});
    expect(!!c).toBe(true);
    expect(c.valid).toBe(true);
    expect(c.constants.width).toBe(500);
    expect(c.constants.height).toBe(500);
    expect(Canvas.length()).toBe(1);
  });

  it('should fail to create Canvas with missing property', function () {
    var c = Canvas.create('main', {height: 500, element: 'canvas-element'});
    expect(c.valid).toBe(false);
  });

});
