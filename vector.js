
function v(x, y) {
  return new Vector(x, y)
}
function Vector (x, y) {
  if('object' === typeof x && x) {
    this.x = x.x || 0;
    this.y = x.y || 0;
  } else {
    this.x = x || 0;
    this.y = y || 0;
  }
}

Vector.a2v = function (a) { return new Vector(Math.cos(a), Math.sin(a)) }
Vector.prototype = {
  dot: function (v) {
    return this.x * v.x + this.y * v.y 
  },
  length: function () {
    return Math.sqrt(this.x*this.x + this.y*this.y)
  },
  iadd: function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  },
  isub: function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  },
  imul: function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  },
  idiv: function (scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  },
  izero: function () {
    this.x = 0;
    this.y = 0;
    return this;
  },
  inor: function () {
    var l = this.length();
    this.x /= l;
    this.y /= l;    
    return this;
  },
  add: function (v) {
    return new Vector(this).iadd(v);
  },
  sub: function (v) {
    return new Vector(this).isub(v);
  },
  mul: function (v) {
    return new Vector(this).imul(v);
  },
  div: function (v) {
    return new Vector(this).idiv(v);  
  },
  nor: function () {
    return new Vector(this).inor();  
  },
  //always positive
  diff: function (v) {
    return new Vector(
      Math.abs(this.x - v.x),
      Math.abs(this.y - v.y)    
    ) 
  },
  //distance between this and the other point.
  dist: function (v) {
    return this.diff(v).length()  
  },
  angle: function () {
    return Math.atan(this.x/this.y) * (this.x > 0 ? 1 : -1 ) 
  }
}