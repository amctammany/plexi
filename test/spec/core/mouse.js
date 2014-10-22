'use strict';

describe('plexi::Mouse', function () {
  var Mouse, m1, m2;
  var events = {
    'mousedown': ['World', 'select', '@x', '@y'],
    'mouseup': ['Mouse', 'use', 'selected'],
  };

  beforeEach(function () {
    plexi.reset();
    Mouse = plexi.module('Mouse');
    m1 = Mouse.create('m1', events);
    m2 = Mouse.create('m2', events);
    //if (!!!Mouse.token) {
      //plexi.subscribe('Mouse', Mouse.dispatch);
    //}
  });

  it('should be true', function () {
    expect(!!Mouse).toBe(true);
    expect(!!m1).toBe(true);
    expect(!!m2).toBe(true);
  });

  it('should manage current mouse', function () {
    //Mouse.reset();
    Mouse.change('m1');
    expect(Mouse.current().id).toBe('m1');
    Mouse.change('m2');
    expect(Mouse.current().id).toBe('m2');
  });

  it('should publish mousedown event to current', function () {
    plexi.publish(['Mouse', 'event', 'mousedown', 100, 125]);
  });

  it('should publish mouseup event to current', function () {
    plexi.publish(['Mouse', 'event', 'mouseup', 100, 125]);
  });


});
