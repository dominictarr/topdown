

  function createMissile(parent) {
    var f = a2v(parent.turretAngle + parent.angle)
    var o = addToVector(copyVector(parent.origin), f, 20)
    var bullet = {
      type: 'missile',
      parent: parent,
      origin: o,
      facing: f,
      speed: 100,
      radius: 2,
      name: 'missile',
      move: function (slice) {
        addToVector(this.origin, this.facing, this.speed)
      },
      touch: function (other) {
        //don't shoot yourself in the foot
        if(other === this.parent)
          return
  
        this.speed = 0
        //iterate 
        //otherwise, explode.
        //find all
        var self = this

        console.error(other.name, 'is explode')
        /*world.near(this.origin, 200, function (thing, dist) {
          if(thing != self)
            console.error(thing.name, 'is explode', thing)
        })*/
        world.rm(this)
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

    var exp = 
    new BitmapAnimation(
      new SpriteSheet({
        images: ['images/explosion_sheet.png'],
        frames: {frameWidth:5, frameHeight: 5},
        animations: {
          explode: [0, 25, false]
        }
      })
    )
    
    m.shape = new Shape(g)
    //m.shape = new Bitmap('images/explosion_sheet.png')
    exp.currentAnimationFrame = 6
    stage.addChild(m.shape)
  },
  update: function (m) {
      m.shape.x = m.origin[0]
      m.shape.y = m.origin[1]
  }
})