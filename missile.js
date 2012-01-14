

/*

  BUG
  
  when a missile hits, it stops the next missile, which may be in mid air.
  maybe this is a leaky global? or a for (var ... or something like that?

*/

  function createMissile(parent) {
    var f = Vector.a2v(parent.turretAngle + parent.angle)
    var velocity = f.mul(20)
    var o = new Vector(parent.origin).iadd(velocity)
    var bullet = {
      type: 'missile',
      parent: parent,
      origin: o,
      velocity: velocity,
      facing: f, //TODO add parent's velocity to facing for realism.
      speed: 10,
      radius: 2,
      hit: 0,
      name: 'missile',
      move: function (slice) {
        this.origin.iadd(this.velocity)
        //addToVector(this.origin, this.facing, this.speed)
      },
      touch: function (other) {
        //don't shoot yourself in the foot
        if(other === this.parent) return
  
        this.speed = 0
        this.hit = 1
        var self = this
        if('tank' == other.type)
          other.health -= 34
        console.error(other.name, 'is explode')
        //need a next tick thing
        this.update = function () {
          world.rm(this)
        }
      }
    }
    return bullet
  }

view.add({
  type: 'missile',
  init: function (m) {
    var g = new Graphics()
    g.setStrokeStyle( 1 );

    g.beginStroke( Graphics.getRGB( 0, 255, 0 ) );
    g.moveTo(0,0)
    g.lineTo( m.facing.x * 20, m.facing.y * 20);
    g.endStroke();
    console.error('MISSILE INIT', m.origin.x, m.origin.y)

    m.shape = new Shape(g)
    stage.actors.addChild(m.shape)
  },
  update: function (m) {
    if(m.hit) {
      var exp = new BitmapAnimation(expSheet)
      stage.actors.removeChild(m.shape)
      stage.actors.addChild(exp)
      exp.onAnimationEnd = function () {
        stage.actors.removeChild(exp)     
        world.rm(m) 
      }
      m.shape = exp
      exp.gotoAndPlay(0)
    }
      
    m.shape.x = m.origin.x
    m.shape.y = m.origin.y
  }
})