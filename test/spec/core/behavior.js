'use strict';

describe('plexi::Behavior', function () {
  var Behavior;
  beforeEach(function () {
    //plexi = plexi.clone();
    Behavior = plexi.module('Behavior');
    //Circle = plexi.behavior('Circle');
    //Rectangle = plexi.behavior('Rectangle');


  });

  it('should be true', function () {
    expect(!!Behavior).toBe(true);
    //console.log()
    //expect(!!Circle).toBe(true);
    //expect(!!Rectangle).toBe(true);

    //expect(Behavior.length()).toBe(2);
  });

});
