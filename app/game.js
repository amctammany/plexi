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
        {type: 'hero', x: 120, y: 100, state: 'ready'},
        {type: 'hero', x: 200, y: 150, state: 'selected'},
        {type: 'button', x: 150, y: 250, text: 'click me', action: ['Stage', 'change', 'level']},
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

  Game: {
    'main': {
      defaults: {
        World: 'main',
        Canvas: 'main',
        Mouse: 'default',
        Stage: 'intro',
      },
      foo: 'bar',
    }
  },
};

plexi.load(config);

plexi.bootstrap('main');
