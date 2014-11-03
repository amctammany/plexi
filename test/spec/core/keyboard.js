'use strict';

describe('plexi::Keyboard', function () {
  var Keyboard, k1,
      k1Config = {
        keys: {
          'a': ['hero', 'move', -5, 0],
          'd': ['hero', 'move', 5, 0],
          'w': ['hero', 'move', 0, 5],
          's': ['hero', 'move', 0, -5],
        }
      };

  beforeEach(function () {
    Keyboard = plexi.module('Keyboard');
    k1 = Keyboard.create('k1', k1Config);
    Keyboard.change('k1');
  });

  it('should be true', function () {
    expect(!!Keyboard).toBe(true);
    expect(!!k1).toBe(true);
  });

  it('should call defined key event', function () {
    var event = Keyboard.dispatch(['key', 'a']);
    expect(event).toBe(k1Config.keys['a']);
  });
});
