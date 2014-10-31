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
    'button': {
      behaviors: ['Button'],
      fill: 'green',
      textColor: 'red',
      padding: 10,

    },
    'hero': {
      behaviors: ['Circle'],
      fill: 'blue',
      stroke: 'green',
      radius: 20,

      states: {
        'default': [
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
      fill: 'red',
      stroke: 'green',
      width: 30,
      height: 15,

      states: {
        'default': [
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
        {type: 'button', x: 150, y: 250, text: 'level one', action: [['Stage', 'change', 'level'], ['Level', 'change', 'one']]},
        {type: 'button', x: 250, y: 250, text: 'level two', action: [['Stage', 'change', 'level'], ['Level', 'change', 'two']]},
      ]
    },
    'level': {
      bodies: [
        {type: 'button', x: 5, y: 5, text: 'Back', action: ['Stage', 'change', 'intro']},
      ],
    },
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
    'two': {
      bodies: [
        {type: 'hero', x: 400, y: 400},
        {type: 'enemy', x: 200, y: 200},
        {type: 'enemy', x: 250, y: 240},
        {type: 'enemy', x: 200, y: 100},
      ]
    },

  },

  Mouse: {
    'default': {
      events: {
        'mousedown': ['World', 'select', '@x', '@y'],
      }
    },
    'selected': {
      events: {
        'mousedown': ['Mouse', 'change', 'default'],
      },
    },
  },

  Keyboard: {
    'default': {
      keys: {
        'A': ['hero', 'move', -5, 0],
        'D': ['hero', 'move', 0, -5],
        'W': ['hero', 'move', 5, 0],
        'S': ['hero', 'move', 0, 5],

      },
    },
  },

  Game: {
    'main': {
      defaults: {
        World: 'main',
        Canvas: 'main',
        Mouse: 'default',
        Keyboard: 'default',
        Stage: 'intro',
      },
      foo: 'bar',
    }
  },
};

plexi.load(config);

plexi.bootstrap('main');
