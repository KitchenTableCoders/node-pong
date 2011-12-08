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
  this.playerA = {rect: rect(50, 220, 10, 40),
                  velocity: vector(0, 0)};
  this.playerB = {rect: rect(580, 220, 10, 40),
                  velocity: vector(0, 0)};
  this.ball    = {rect: rect(320, 240, 5, 5),
                  velocity: vector(0, 0)};
  this.init();
};

Pong.prototype = {
  init: function() {
    this.attachEvents();
    this.runLoop();
  },

  attachEvents: function() {
    var self = this;
    // TODO: swap in websocket events
    window.addEventListener("keydown", function(e) {
      self.handleKeyPress(e.keyCode);
    });
  },

  runLoop: function() {
    this.checkGameState();
    this.update();
    this.draw();
    var self = this;
    setTimeout(function() { self.runLoop(); }, 33);
  },

  checkGameState: function() {
    var state = this.state;
    if(!state.playing) {
      if(state.gamesPlayed == 5) {
        state.done();
      } else {
        state.playing = true;
        this.startMatch();
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
    this.drawRect(ctxt, this.playerA.rect); // draw paddles
    this.drawRect(ctxt, this.playerB.rect);
    this.drawRect(ctxt, this.ball.rect);    // draw ball
  },

  clearScreen: function(ctxt) {
    ctxt.fillStyle = "rgba(0, 0, 0, 1.0)";
    ctxt.fillRect(0, 0, 640, 480);
  },

  drawRect: function(ctxt, rect) {
    ctxt.fillRect(rect.origin.x, rect.origin.y,
                  rect.size.width, rect.size.height);
  }
};

// =============================================================================
// Init

function init() {
  console.log("Starting pong.js");
  var game = new Pong(document.getElementById("pong"));
};