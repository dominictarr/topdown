/* player behaviour*/

function createTank (name, origin) {
  return {
    type: 'tank',
    name: name,
    origin: origin || new Vector(100, 100),
    velocity: new Vector(),
    angle: 0,
    turretAngle: 0,
    facing: Vector.a2v(0), // or as angle?
    r: 8,
    l: 16,
    w: 16,
    radius: 20,
    accelerate: false,
    maxSpeed: 100,
    health: 100,
    speed: 0,
    acceleration: 32,
    deacceleration: 24,
    touch: function (other) {

      if(other.type == 'missile') //solid?
        return

      //calculate angle to other object, and bump away from it.
      //reduce speed by the dot product of the facing
      var d = this.origin.sub(other.origin).inor().dot(this.facing)
      if(d*this.speed < 0)
        this.speed = d*6
    },
    move: function (slice, time) {
      if(this.health < 0) {
        if(!this.dead)
          this.dead = true, callif(this.ondeath, this, [])
        return //dead!
      }
      var p = this

      p.angle = p.angle || 0
      p.turretAngle = p.turretAngle  || 0
      p.angle += Math.PI*-0.3*(p.turn || 0)*slice
      p.turretAngle += Math.PI*-1*(p.rotate || 0)*slice

      assert(!isNaN(p.angle), "NaN angle")

      if(p.fire && (!p.reload || p.reload < time)) {
        p.flash.visible = true
        p.reload = time + 1
        world.add(createMissile(this)) 
      } else p.flash.visible = false
    
      p.facing = Vector.a2v(p.angle)
      p.speed += (p.accelerate) * p.acceleration * slice

      if(!p.accelerate) {
        p.speed -= p.speed/0.9 * slice
        if(p.speed < 0) p.speed = 0
      }

      if(p.speed > p.maxSpeed)      p.speed = p.maxSpeed
      if(p.speed < p.maxSpeed * -1) p.speed = p.maxSpeed * -1
    
      var velocity = p.facing.mul(p.speed * slice)
//      addToVector([0,0], p.facing, p.speed * slice)

        p.origin.iadd(velocity)
  //    addToVector(p.origin, velocity)

      var wm = 0, wM = canvas.width, hm = 0, hM = canvas.height

      if(p.origin.x < wm)  p.origin.x = wM
      if(p.origin.y < hm)  p.origin.y = hM
      if(p.origin.x > wM)  p.origin.x = wm
      if(p.origin.y > hM)  p.origin.y = hm
    }
  }
}

/*draw the player*/


function image(id) {
  return document.getElementById(id)
}

//add stuff to load the sprites
var tankView = {
  type: 'tank',
  sprites: {
    green_hull  : new Bitmap('images/green_hull.png'),
    green_turret: new Bitmap('images/green_turret.png'),
    green_flash : new Bitmap('images/green_turret_flash.png'),
    brown_hull  : new Bitmap('images/brown_hull.png'),
    brown_turret: new Bitmap('images/brown_turret.png'),
    brown_flash : new Bitmap('images/brown_turret_flash.png'),
  },
  init: function (p) {
    if(p.shape)
      throw new Error('already initialized tank')
    
    function s(part) {
      return tankView.sprites[p.name+'_' + part].clone()
    }

    var hull    = s('hull')
    var turret  = s('turret') 
    var flash   = s('flash')

    //g.beginBitmapStroke(hull.image)
    //ahh, it hasn't loaded yet

    hull.regX = 32;
    hull.regY = 32;
    hull.rotation = 90

    copyTo(flash, copyTo(turret, {
      x:0,
      regX: 32,
      regY: 34,
    }))

    p.turret = turret
    p.flash = flash
    p.facing = Vector.a2v(p.angle)

    p.shape = new Container()
    p.shape.addChild(hull)
    p.shape.addChild(turret)
    p.shape.addChild(flash)
    flash.visible = false

    //split this into motion and drawing.
    //so that motion is decoupled from drawing.
    p.move(0, Date.now()/1000)
    this.update(p)
    stage.actors.addChild(p.shape)
  },
  update: function (p) {
    if(p.health <= 0) {
      if (p.turret) {
        p.shape.removeChild(p.turret)
        p.turret = null
      }
      return
    }

    p.shape.rotation  = (p.angle/Math.PI)*180
    p.turret.rotation = (p.turretAngle/Math.PI)*180 + 90
    p.flash.rotation  = (p.turretAngle/Math.PI)*180 + 90
    p.shape.x = p.origin.x
    p.shape.y = p.origin.y    
  }
}

view.add(tankView)
