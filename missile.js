

/*

  BUG
  
  when a missile hits, it stops the next missile, which may be in mid air.
  maybe this is a leaky global? or a for (var ... or something like that?

*/

  function createMissile(parent) {
    var f = Vector.a2v(parent.turretAngle + parent.angle)
    var velocity = f.mul(20)
    var o = new Vector(parent.origin).iadd(velocity)
    return {
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
  
        this.touch = null
        this.speed = 0
        this.hit = 1
        this.velocity.izero()
        var self = this
        if('tank' == other.type)
          other.health -= 34
        console.error(other.name, 'is explode')
        //need a next tick thing
        this.update = function () {
          //world.rm(this)
        }
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
    g.lineTo( m.facing.x * 20, m.facing.y * 20);
    g.endStroke();
    console.error('MISSILE INIT', m.origin.x, m.origin.y)

    m.shape = new Shape(g)
    stage.actors.addChild(m.shape)
  },
  rm: function (m) {
//    console.log(m)
  },
  update: function (m) {
    if(m.hit && !m.explode) {
      var exp = new BitmapAnimation(expSheet)
      stage.actors.addChild(exp)
      stage.actors.removeChild(m.shape)
      exp.onAnimationEnd = function () {
        stage.actors.removeChild(exp)     
      }
      m.shape = exp
      exp.gotoAndPlay(0)
      m.explode = true
    }
      
    m.shape.x = m.origin.x
    m.shape.y = m.origin.y
  }
})