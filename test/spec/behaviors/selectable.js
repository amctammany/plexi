'use strict';

describe('behavior::Selectable', function () {
  var Selectable, Hero;

  beforeEach(function () {
    Selectable = plexi.behavior('Selectable');
    Hero = plexi.module('BodyType').create('hero', {behaviors: ['Selectable'], states: {selected: ['fill', 'blue'], default: ['fill', 'green']}, selectAction: ['toggleState', 'selected']});
  });

  it('should be true', function () {
    expect(!!Selectable).toBe(true);
    expect(!!Hero).toBe(true);
  });

  it('should have select(body) method from prototype', function () {
    expect(Hero.select).toBe(Selectable.constructor.prototype.select);
  });
  it('should call selectAction', function () {
    var h1 = Hero.createBody({});
    var h2 = Hero.createBody({});
    Hero.select(h1);
    expect(h1.state).toBe('selected');
    Hero.select(h1);
    expect(h1.state).toBe('default');

  });

});

