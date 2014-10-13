var config = {
  Canvas: {
    'main': {
      element: 'game-canvas',
      width: 600,
      height: 600,
    },
  },
  World: {
    'main': {

    },
  },

  BodyType: {
    'hero': {
      behaviors: ['Circle'],
      fill: 'blue',
      radius: 20,

      states: {
        'ready': [
          ['fill', 'blue'],
          ['stroke', 'green']
        ],
        'selected': [
          ['fill', 'red'],
          ['stroke', 'black']
        ]
      }
    },
    'enemy': {
      behaviors: ['Rectangle'],
      fill: 'blue',
      width: 30,
      height: 15,

      states: {
        'ready': [
          ['fill', 'blue'],
          ['stroke', 'green']
        ],
        'selected': [
          ['fill', 'red'],
          ['stroke', 'black']
        ]
      }
    }

  },

  Stage: {
    'intro': {
      bodies: [
        {type: 'hero', x: 100, y: 100},
      ]
    }
  },

  Level: {
    'one': {
      bodies: [
        {type: 'hero', x: 100, y: 100},
        {type: 'enemy', x: 200, y: 100},
        {type: 'enemy', x: 150, y: 140},
        {type: 'enemy', x: 100, y: 200},
      ]
    },
  },

  Mouse: {
    'default': {
      events: {
        'mousedown': ['World', 'select', '@x', '@y'],
      }
    }
  },

  Game: {
    'main': {
      current: {
        World: 'main',
        Canvas: 'main',
        Mouse: 'default',
        Stage: 'intro',
      },
      foo: 'bar',
    }
  },
};
