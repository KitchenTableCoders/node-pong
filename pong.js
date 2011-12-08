function Pong(el) {
  this.ctxt = el.getContext('2d');
  this.state = {
    playing: false,
    played: 0,
    score: {
      playerA: 0,
      playerB: 0
    }
  };
  this.playerA = {location:{x:10, y:240}};
  this.playerB = {location:{x:630, y:240}};
  this.ball    = {location:{x:320, y:240}};
  this.init();
};

Pong.prototype = {
  init: function() {
    this.attachEvents();
    this.runLoop();
  },

  attachEvents: function() {
    var self;
    // TODO: swap in websocket events
    window.addEventListener("keydown", function(e) {
      self.handleKeyPress(e.keyCode);
    });
  },

  runLoop: function() {
    this.checkGameState();
    this.update();
    this.draw();
    setTimeout(function() { self.runLoop() }, 33);
  },

  checkGameState: function() {
    if(!this.playing) {
      if(this.played == 5) {
        this.done();
      } else {
        this.nextGame();
      }
    }
  },

  done: function() {
  },

  startMatch: function() {
  },

  nextGame: function() {
    this.ball.location = {x:320, y:240};
  },

  dropBall: function() {
  },

  handleKeyPress: function(keyCode) {
    console.log(keyCode);
  },

  update: function() {
  },

  checkBall: function() {
  },

  draw: function() {
    this.drawPaddle(this.playerA);
    this.drawPaddle(this.playerB);
    this.drawBall();
  },

  drawPaddle: function() {
  },

  drawBall: function() {
  }
};

function init() {
  console.log("Starting pong.js");
  var game = new Pong($('pong'));
};