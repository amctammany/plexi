'use strict';
describe('plexi::Behavior::Group', function () {
  var Group, button, g;

  beforeEach(function () {
    Group = plexi.behavior('Group');
    button = plexi.module('BodyType').create('button', {behaviors: ['Button'], width: 50, height: 20});
    g = plexi.module('BodyType').create('g', {behaviors: ['Group'], template: 'button', group: [{text: 'one', action: ['Level', 'change', 'one']}, {text: 'two', action: ['Level', 'change', 'two']}], x: 0, y: 0, width: 200, height: 200, padding: 5});
  });

  it('should be true', function () {
    expect(!!Group).toBe(true);
    expect(!!button).toBe(true);
    expect(!!g).toBe(true);
  });

});
