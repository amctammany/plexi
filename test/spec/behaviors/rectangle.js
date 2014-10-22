'use strict';

describe('behavior::Rectangle', function () {
  var Rectangle;

  beforeEach(function () {
    Rectangle = plexi.behavior('Rectangle');
  });

  it('should be true', function () {
    expect(!!Rectangle).toBe(true);
  });

});

