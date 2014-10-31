'use strict';

describe('plexi::BodyType', function () {
  var BodyType, type;
  var bodyConfig = {
    id: 'hero-unit',
    x: 10,
    y: 20,
    state: 'default',
  };


  beforeEach(function () {
    plexi = plexi.clone();
    BodyType = plexi.module('BodyType');
    type = BodyType.create('hero', {
      radius: 15,
      states: {
        'default': [['fillStyle', 'black']],
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

  it('should change body state', function () {
    var body = type.createBody(bodyConfig);
    type.changeState(body, 'selected');
    expect(body.state).toBe('selected');
  });
  it('should fail to change state if not in statuses', function () {
    var body = type.createBody(bodyConfig);
    var oldState = body.state;
    type.changeState(body, 'foobar');
    expect(body.state).toBe(oldState);
  });
});
