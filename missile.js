

  function createMissile(parent) {
    var f = a2v(parent.turretAngle + parent.angle)
    var o = addToVector(copyVector(parent.origin), f, 20)
    var bullet = {
      type: 'missile',
      parent: parent,
      origin: o,
      facing: f,
      speed: 10,
      radius: 2,
      hit: 0,
      name: 'missile',
      move: function (slice) {
        addToVector(this.origin, this.facing, this.speed)
      },
      touch: function (other) {
        //don't shoot yourself in the foot
        if(other === this.parent) return
  
        this.speed = 0
        this.hit = 1
        var self = this
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
  useSprites: {
    explosion: 'images/explosion_sheet.png'
  },
  init: function (m) {
    var g = new Graphics()
    g.setStrokeStyle( 1 );

    g.beginStroke( Graphics.getRGB( 0, 255, 0 ) );
    g.moveTo(0,0)
    g.lineTo( m.facing[0] * 20, m.facing[1] * 20);
    g.endStroke();

    m.shape = new Shape(g)
    stage.addChild(m.shape)
  },
  update: function (m) {
    if(m.hit) {
      var exp = new BitmapAnimation(expSheet)
      stage.removeChild(m.shape)
      stage.addChild(exp)
      exp.onAnimationEnd = function () {
        stage.removeChild(exp)     
        world.rm(m) 
      }
      m.shape = exp
      exp.gotoAndPlay(0)
    }
      
    m.shape.x = m.origin[0]
    m.shape.y = m.origin[1]
  }
})