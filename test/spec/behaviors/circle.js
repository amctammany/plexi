'use strict';

describe('behavior::Circle', function () {
  var Circle;

  beforeEach(function () {
    Circle = plexi.behavior('Circle');
  });

  it('should be true', function () {
    expect(!!Circle).toBe(true);
  });

});

