// =============================================================================
// Helpers

var socket = io.connect('http://localhost:8181');

console.log(socket);

var controls = {
  A_UP: 87, // W
  A_DOWN: 83, // S
  B_UP: 79, // O
  B_DOWN: 76 // L
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
    console.log("init");
    this.attachEvents();
    this.runLoop();
  },

  attachEvents: function() {
    var self = this;
    window.addEventListener("keydown", function(e) {
      self.handleKeyPress(e.keyCode);
    });
    socket.on("playera", function(msg) {
      console.log(msg);
      self.playerA.velocity = msg.velocity;
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
    console.log("start match");
    // reset ball location and velocity
    this.ball.rect.origin = vector(320, 240);
    this.ball.velocity = vector(5, 5);
    if(this.state.turn) { // NEVER DO THIS EVER - 0 is falsy
      this.ball.velocity.x *= -1;
    }
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
        pB = this.playerB,
        ball = this.ball;
    pA.rect.origin.y = this.bound(pA.rect.origin.y+pA.velocity, 0, 440);
    pA.velocity = 0;
    pB.rect.origin.y = this.bound(pB.rect.origin.y+pB.velocity, 0, 440);
    pB.velocity = 0;
    ball.rect.origin = vadd(ball.rect.origin, ball.velocity);
    this.checkBall();
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

  collision: function(ra, rb) {
    return (ra.origin.x < rb.origin.x+rb.size.width) &&
           (ra.origin.x+ra.size.width > rb.origin.x) &&
           (ra.origin.y < rb.origin.y+rb.size.height) &&
           (ra.origin.y+ra.size.height > rb.origin.y);
  },

  checkBall: function() {
    var state = this.state,
        playerA = this.playerA,
        playerB = this.playerB,
        ball = this.ball;
    if(state.playing && ball.rect.origin.x < -5) {
      state.score.playerB++;
      state.gamesPlayed++;
      state.turn = state.turn ? 0 : 1;
      state.playing = false;
      socket.emit("playera-loss");
    } else if(state.playing && ball.rect.origin.x > 640) {
      state.score.playerA++;
      state.gamesPlayed++;
      state.turn = state.turn ? 0 : 1;
      state.playing = false;
      socket.emit("playera-win");
    } else if(state.serve != "A" && this.collision(playerA.rect, ball.rect)) {
      state.serve = "A";
      ball.velocity.x *= -1;
    } else if(state.serve != "B" && this.collision(playerB.rect, ball.rect)) {
      state.serve = "B";
      ball.velocity.x *= -1;
    } else if(this.ball.rect.origin.y < 0 || ball.rect.origin.y > 475) {
      ball.velocity.y *= -1;
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