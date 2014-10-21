'use strict';

describe('plexi::Mouse', function () {
  var Mouse, m;
  var events = {
    'mousedown': ['World', 'select', '@x', '@y'],
    'mouseup': ['Mouse', 'use', 'selected'],
  };

  beforeEach(function () {
    plexi.reset();
    Mouse = plexi.module('Mouse');
    m = Mouse.create('mouse', events);
    if (!!Mouse.token) {
      plexi.subscribe('Mouse', Mouse.dispatch);
    }
  });

  it('should be true', function () {
    expect(!!Mouse).toBe(true);
    expect(!!m).toBe(true);
  });

  it('should publish mousedown event to current', function () {
    plexi.publish(['Mouse', 'event', 'mousedown', 100, 125]);
  });

  it('should publish mouseup event to current', function () {
    plexi.publish(['Mouse', 'event', 'mouseup', 100, 125]);
  });


});
