
  function createMissile(parent) {
    var f = Vector.a2v(parent.turretAngle + parent.angle)
    var velocity = f.mul(CANNON_SPEED)
    var o = new Vector(parent.origin).iadd(velocity)
    return {
      type: 'missile',
      parent: parent,
      origin: o,
      velocity: velocity,
      facing: f, //TODO add parent's velocity to facing for realism.
      radius: 2,
      hit: 0,
      name: 'missile',
      move: function (slice) {
        this.origin.iadd(this.velocity)

        var wm = 0, wM = canvas.width, hm = 0, hM = canvas.height
        if(this.origin.x < wm || this.origin.y < hm || this.origin.x > wM || this.origin.y > hM)
          world.rm(this) //has left the game board
        //addToVector(this.origin, this.facing, this.speed)
      },
      touch: function (other) {
        //don't shoot yourself in the foot
        if(other === this.parent) return
  
        this.touch = null
        this.speed = 0
        this.hit = 1
        this.velocity.izero()
        var self = this
        if('tank' == other.type)
          other.health -= CANNON_DAMAGE
        console.error(other.name, 'is explode')
      }
    }
  }

view.add({
  type: 'missile',
  init: function (m) {
    var g = new Graphics()
    g.setStrokeStyle( 1 );
    g.beginStroke( Graphics.getRGB( 0, 255, 0 ) );
    g.moveTo(0,0)
    g.lineTo( m.facing.x*CANNON_SPEED, m.facing.y*CANNON_SPEED);
    g.endStroke();
    m.shape = new Shape(g)
    stage.actors.addChild(m.shape)
  },
  rm: function (m) {
    if(m.shape)
      stage.actors.removeChild(m.shape)
    m.shape = null
  },
  update: function (m) {
    if(m.hit && !m.explode) {
      var exp = new BitmapAnimation(expSheet)
      stage.actors.addChild(exp)
      stage.actors.removeChild(m.shape)
      exp.onAnimationEnd = function () {
        stage.actors.removeChild(exp)
        world.rm(m) 
      }
      m.shape = exp
      exp.gotoAndPlay(0)
      m.explode = true
    }
    m.shape.x = m.origin.x
    m.shape.y = m.origin.y
  }
})