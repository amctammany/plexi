'use strict';

describe('behavior::Particle', function () {
  var Particle;

  beforeEach(function () {
    Particle = plexi.behavior('Particle');
  });

  it('should be true', function () {
    expect(!!Particle).toBe(true);
  });

});
