'use strict';

describe('behavior::Button', function () {
  var Button;

  beforeEach(function () {
    Button = plexi.behavior('Button');
  });

  it('should be true', function () {
    expect(!!Button).toBe(true);
  });

});

