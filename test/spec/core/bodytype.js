'use strict';

describe('plexi::BodyType', function () {
  var BodyType, type;
  var bodyConfig = {
    id: 'hero-unit',
    x: 10,
    y: 20,
  };


  beforeEach(function () {
    plexi = plexi.clone();
    BodyType = plexi.module('BodyType');
    type = BodyType.create('hero', {
      radius: 15,
      states: {
        'ready': [['fillStyle', 'black']],
        'selected': [['fillStyle', 'red']],
      }
    });

  });

  it('should be true', function () {
    expect(!!BodyType).toBe(true);
  });

  it('should create new BodyType', function () {
    expect(!!type).toBe(true);
    expect(BodyType.length()).toBe(1);
  });
  it('should create new body from BodyType', function () {
    var body = type.createBody(bodyConfig);
    expect(!!body).toBe(true);
    expect(body.x).toBe(bodyConfig.x);
    expect(body.y).toBe(bodyConfig.y);
  });
});
