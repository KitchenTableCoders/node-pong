// =============================================================================
// Helpers

var controls = {
  A_UP: 87,
  A_DOWN: 83,
  B_UP: 79,
  B_DOWN: 76
};

function vector(x, y) {
  return {
    x: x,
    y: y
  };
}

function vadd(v1, v2) {
  return {
    x: v1.x+v2.x,
    y: v1.y+v2.y
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
                  velocity: 0};
  this.playerB = {rect: rect(580, 220, 10, 40),
                  velocity: 0};
  this.ball    = {rect: rect(320, 240, 5, 5),
                  velocity: 0};
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
    switch(keyCode) {
      case controls.A_UP:
        this.playerA.velocity = -10;
        break;
      case controls.A_DOWN:
        this.playerA.velocity = 10;
        break;
      case controls.B_UP:
        this.playerB.velocity = -10;
        break;
      case controls.B_DOWN:
        this.playerB.velocity = 10;
        break;
      default:
        break;
    }
  },

  update: function() {
    var pA = this.playerA,
        pB = this.playerB;
    pA.rect.origin.y = this.bound(pA.rect.origin.y+pA.velocity, 0, 480);
    pA.velocity = 0;
    pB.rect.origin.y = this.bound(pB.rect.origin.y+pB.velocity, 0, 480);
    pB.velocity = 0;
  },

  bound: function(n, lower, upper) {
    if(n < lower) {
      return lower;
    } else if(n > upper) {
      return upper;
    } else {
      return n;
    }
  },

  checkBall: function() {
    var state = this.state;
    if(state.playing && ball.rect.origin.x < -5) {
      state.score.playerA++;
      state.gamesPlayed++;
      state.playing = false;
    } else if(state.playing && ball.rect.origin.x > 640) {
      state.score.playerB++;
      state.gamesPlayed++;
      state.playing = false;
    } else if(this.serve != "A" && collision(this.playerA.rect, this.ball.rect)) {
      this.state.serve = "A";
      this.ball.velocity.x *= -1;
    } else if(this.serve != "B" && collision(this.playerB.rect, this.ball.rect)) {
      this.state.serve = "B";
      this.ball.velocity.x *= -1;
    }
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