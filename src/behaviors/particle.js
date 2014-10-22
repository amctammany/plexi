'use strict';

plexi.behavior('Particle', function (define) {
  var Particle = function () {
    this.addProps(['x', 'y', 'mass', 'velocity', 'acceleration', 'forceAccumulator']);
  };

  return define(Particle);
});
