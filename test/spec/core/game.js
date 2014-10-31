'use strict';

describe('plexi::Game', function () {
  var Game, g;

  beforeEach(function () {
    plexi.reset();
    Game = plexi.module('Game');
    g = Game.create('main', {defaults: {
      World: 'main',
      Canvas: 'main',
      Mouse: 'default',
      Stage: 'intro'
    }, username: 'foobar'});
  });

  it('should be true', function () {
    expect(!!Game).toBe(true);
  });

  it('should create Game', function () {
    expect(!!g).toBe(true);
    expect(g.valid).toBe(true);
    expect(g.defaults.Stage).toBe('intro');
    expect(g.defaults.World).toBe('main');
    expect(g.defaults.Canvas).toBe('main');
    expect(g.defaults.Mouse).toBe('default');
    expect(g.constants.username).toBe('foobar');
    expect(Game.length()).toBe(1);
  });
});
