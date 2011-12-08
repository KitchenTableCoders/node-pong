// =============================================================================
// Helpers

function vector(x, y) {
  return {
    x: x,
    y: y
  };
}

function size(w, h) {
  return {
    width: w,
    height: h
  };
}

function rect(x, y, w, h) {
  return {
    origin: vector(x, y),
    size: size(w, h)
  };
}

// =============================================================================
// Game

function Pong(el) {
  this.ctxt = el.getContext('2d');
  this.state = {
    turn: 0, 
    playing: false,
    gamesPlayed: 0,
    score: {
      playerA: 0,
      playerB: 0
    }
  };
  this.playerA = {location: rect(50, 210, 10, 20),
                  velocity: vector(0, 0)};
  this.playerB = {location: rect(490, 210, 10, 20),
                  velocity: vector(0, 0)};
  this.ball    = {location: rect(320, 240, 5, 5),
                  velocity: vector(0, 0)};
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
    var state = this.state;
    if(!state.playing) {
      if(state.gamesPlayed == 5) {
        state.done();
      } else {
        state.playing = true;
        state.startMatch();
      }
    }
  },

  startMatch: function() {
    // set the ball to it's initial position
  },

  handleKeyPress: function(keyCode) {
    console.log(keyCode);
  },

  update: function() {
    // apply the velocity
  },

  checkBall: function() {
    // check collisions
  },

  draw: function() {
    var ctxt = this.ctxt;
    this.clearScreen(ctxt);
    ctxt.fillStyle = "rgba(255, 255, 255, 1.0)";
    this.drawPaddle(this.playerA.location);
    this.drawPaddle(this.playerB.location);
    this.drawBall(this.ball);
  },

  clearScreen: function(ctxt) {
    ctxt.filleStyle = "rgba(0, 0, 0, 1.0)";
    ctxt.clearRect(0, 0, 640, 480);
  },

  drawPaddle: function(ctxt, loc) {
    ctxt.drawRect();
  },

  drawBall: function() {
    ctxt.drawRect();
  }
};

// =============================================================================
// Init

function init() {
  console.log("Starting pong.js");
  var game = new Pong($('pong'));
};