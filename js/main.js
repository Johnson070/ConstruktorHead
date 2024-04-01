/*=============================================================================*/
/* Smooth Trail
/*=============================================================================*/
var smoothTrail = function(c, cw, ch) {

  /*=============================================================================*/
  /* Initialize
  /*=============================================================================*/
  this.init = function() {
    this.loop();
  };

  /*=============================================================================*/
  /* Variables
      /*=============================================================================*/
  var _this = this;
  this.c = c;
  this.ctx = c.getContext('2d');
  this.cw = cw;
  this.ch = ch;

  //Cursor
  this.x = this.cw / 2;
  this.y = this.ch / 2;

  //trail
  this.trail = [];
  this.maxTrail = 200;

  this.ctx.lineWidth = .1;
  this.ctx.lineJoin = 'round';

  this.radius = 1;
  this.speed = 0.4;
  this.angle = 0;
  this.arcx = 0;
  this.arcy = 0;
  this.growRadius = true;
  this.seconds = 0;
  this.milliseconds = 0;

  /*=============================================================================*/
  /* Utility Functions
      /*=============================================================================*/
  this.rand = function(rMi, rMa) {
    return ~~((Math.random() * (rMa - rMi + 1)) + rMi);
  };

  /*=============================================================================*/
  /* Utility Events
      /*=============================================================================*/
  c.addEventListener("mousemove", function(e) {
    var r = _this.c.getBoundingClientRect();
    _this.x = e.clientX - r.left;
    _this.y = e.clientY - r.top;

    //уменьшаем количество линий, чтобы анимацию не превращалась в кашу при перемещении мыши
    _this.maxTrail = 10;
    //Таймер - чтобы значение вернулось в норму не сразу, а после хотябы одного цикла анимации
    setTimeout(function() {
      _this.maxTrail = 200;
    }, 1)
  });
  c.addEventListener("mouseleave", () => {
    //Возвращаем анимацию в норму, если мышь ушла за canvas
    _this.x = _this.cw / 2;
    _this.y = _this.ch / 2;

  });


  /*=============================================================================*/
  /* Create Point
      /*=============================================================================*/
  this.createPoint = function(x, y) {
    this.trail.push({
      x: x,
      y: y
    });
  };

  /*=============================================================================*/
  /* Update Trail
      /*=============================================================================*/
  this.updateTrail = function() {

    if (this.trail.length < this.maxTrail) {
      this.createPoint(this.arcx, this.arcy);
    }

    if (this.trail.length >= this.maxTrail) {
      this.trail.splice(0, 1);
    }
  };

  /*=============================================================================*/
  /* Update Arc
      /*=============================================================================*/
  this.updateArc = function() {
    this.arcx = (this.x) + Math.sin(this.angle) * this.radius;
    this.arcy = (this.y) + Math.cos(this.angle) * this.radius;
    var d = new Date();
    this.seconds = d.getSeconds();
    this.milliseconds = d.getMilliseconds();
    this.angle += this.speed * (this.seconds + 1 + (this.milliseconds / 1000));

    if (this.radius <= 1) {
      this.growRadius = true;
    }
    if (this.radius >= 200) {
      this.growRadius = false;
    }

    if (this.growRadius) {
      this.radius += 1;
    } else {
      this.radius -= 1;
    }
  };

  /*=============================================================================*/
  /* Render Trail
      /*=============================================================================*/
  this.renderTrail = function() {
    var i = this.trail.length;

    this.ctx.beginPath();
    while (i--) {
      var point = this.trail[i];
      var nextPoint = (i == this.trail.length) ? this.trail[i + 1] : this.trail[i];

      var c = (point.x + nextPoint.x) / 2;
      var d = (point.y + nextPoint.y) / 2;
      this.ctx.quadraticCurveTo(Math.round(this.arcx), Math.round(this.arcy), c, d);


    };
    this.ctx.strokeStyle = 'hsla(' + this.rand(170, 300) + ', 100%, ' + this.rand(50, 75) + '%, 1)';
    this.ctx.stroke();
    this.ctx.closePath();

  };


  /*=============================================================================*/
  /* Clear Canvas
      /*=============================================================================*/
  this.clearCanvas = function() {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'rgba(0,0,0,.1)';
    this.ctx.fillRect(0, 0, this.cw, this.ch);
    this.ctx.globalCompositeOperation = 'lighter';
  };

  /*=============================================================================*/
  /* Animation Loop
      /*=============================================================================*/
  this.loop = function() {
    var loopIt = function() {
      requestAnimationFrame(loopIt, _this.c);
      _this.clearCanvas();
      _this.updateArc();
      _this.updateTrail();
      _this.renderTrail();
    };
    loopIt();
  };

};

/*=============================================================================*/
/* Check Canvas Support
/*=============================================================================*/
var isCanvasSupported = function() {
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
};

/*=============================================================================*/
/* Setup requestAnimationFrame
/*=============================================================================*/
var setupRAF = function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  };

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  };

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  };
};

/*=============================================================================*/
/* Define Canvas and Initialize
/*=============================================================================*/
if (isCanvasSupported) {
  var c = document.createElement('canvas');
  c.width = 400;
  c.height = 400;
  var cw = c.width;
  var ch = c.height;
  document.body.appendChild(c);
  var cl = new smoothTrail(c, cw, ch);

  setupRAF();
  cl.init();
}
