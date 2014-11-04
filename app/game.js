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
      padding: 5,
    },
    'level-group': {
      behaviors: ['Group'],
      template: 'button',
      padding: 5,
    },
    'hero': {
      behaviors: ['Circle', 'Selectable'],
      fill: 'blue',
      stroke: 'green',
      radius: 20,
      selectAction: ['toggleState', 'selected'],

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
      behaviors: ['Rectangle', 'Selectable'],
      fill: 'white',
      stroke: 'black',
      width: 30,
      height: 15,
      selectAction: ['toggleState', 'selected'],

      states: {
        'default': [
          ['fill', 'white'],
          ['stroke', 'black']
        ],
        'selected': [
          //['fill', 'white'],
          ['stroke', 'red']
        ]
      }
    }

  },

  Stage: {
    'intro': {
      bodies: [
        //{type: 'button', x: 150, y: 250, text: 'level one', action: [['Stage', 'change', 'level'], ['Level', 'change', 'one']]},
        //{type: 'button', x: 250, y: 250, text: 'level two', action: [['Stage', 'change', 'level'], ['Level', 'change', 'two']]},
        {type: 'level-group', x: 50, y: 50, width: 500, height: 500, rows: 4, columns: 1, padding: 5, template: 'button', group: [
          {text: 'level one', action: [['Stage', 'change', 'level'], ['Level', 'change', 'one']]},
          {text: 'level two', action: [['Stage', 'change', 'level'], ['Level', 'change', 'two']]},
          {text: 'level three', action: [['Stage', 'change', 'level'], ['Level', 'change', 'three']]},
          {text: 'level four', action: [['Stage', 'change', 'level'], ['Level', 'change', 'four']]},
        ]}
      ]
    },
    'level': {
      bodies: [
        {type: 'button', x: 5, y: 5, width: 100, height: 25, text: 'Back', action: ['Stage', 'change', 'intro']},
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
    'three': {
      bodies: [
        {type: 'hero', x: 10, y: 10},
        {type: 'enemy', x: 400, y: 100},
        {type: 'enemy', x: 250, y: 200},
        {type: 'enemy', x: 100, y: 50},
      ]
    },
    'four': {
      bodies: [
        {type: 'hero', x: 50, y: 400},
        {type: 'enemy', x: 110, y: 200},
        {type: 'enemy', x: 50, y: 440},
        {type: 'enemy', x: 300, y: 150},
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
