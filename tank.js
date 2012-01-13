/* player behaviour*/

function createPlayer (name, origin) {
  return {
    type: 'tank',
    name: name,
    origin:   origin || [ 100, 100],
    velocity: [ 0, 0 ],
    angle: 0,
    turretAngle: 0,
    facing: a2v(0), // or as angle?
    r: 8,
    l: 16,
    w: 16,
    radius: 20,
    accelerate: false,
    maxSpeed: 100,
    speed: 0,
    acceleration: 24,
    deacceleration: 16,
    touch: function (other) {

      if(other.type == 'missile') //solid?
        return

      //calculate angle to other object, and bump away from it.
      //reduce speed by the dot product of the facing
      var dir = normalize(subtractVectors(this.origin, other.origin))
      var d = dot(dir, this.facing)
      if(d*this.speed < 0)
        this.speed = d*6
    },
    move: function (slice, time) {
      var p = this

      p.angle = p.angle || 0
      p.turretAngle = p.turretAngle  || 0
      p.angle += Math.PI*-1*(p.turn || 0)*slice
      p.turretAngle += Math.PI*-1*(p.rotate || 0)*slice

      assert(!isNaN(p.angle), "NaN angle")

      if(p.fire && (!p.reload || p.reload < time)) {
        p.flash.visible = true
        p.reload = time + 1
        world.add(createMissile(this)) 
      } else p.flash.visible = false
    
      p.facing = a2v(p.angle)
      p.speed += (p.accelerate) * p.acceleration * slice

      if(!p.accelerate) {
        p.speed -= p.speed/0.9 * slice
        if(p.speed < 0) p.speed = 0
      }

      if(p.speed > p.maxSpeed)      p.speed = p.maxSpeed
      if(p.speed < p.maxSpeed * -1) p.speed = p.maxSpeed * -1
    
      var velocity = addToVector([0,0], p.facing, p.speed * slice)

      addToVector(p.origin, velocity)

      var wm = 0, wM = canvas.width, hm = 0, hM = canvas.height

      if(p.origin[0] < wm)  p.origin[0] = wM
      if(p.origin[1] < hm)  p.origin[1] = hM
      if(p.origin[0] > wM)  p.origin[0] = wm
      if(p.origin[1] > hM)  p.origin[1] = hm
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
  useSprites: {
    green_hull: 'images/green_hull.png',
    green_turret: 'images/green_turret.png',
    green_flash: 'images/green_turret_flash.png',
    brown_hull: 'images/brown_hull.png',
    brown_turret: 'images/brown_turret.png',
    brown_flash: 'images/brown_turret_flash.png',
  },
  init: function (p) {
    if(p.shape)
      throw new Error('already initialized tank')
    
    function s(part) {
      return new Bitmap(tankView.sprites[p.name+'_' + part])
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
    p.facing = a2v(p.angle)

    p.shape = new Container()
    p.shape.addChild(hull)
    p.shape.addChild(turret)
    p.shape.addChild(flash)
    flash.visible = false

    //split this into motion and drawing.
    //so that motion is decoupled from drawing.
    p.move(0, Date.now()/1000)
    this.update(p)
    stage.addChild(p.shape)
  },
  update: function (p) {

    p.shape.rotation = (p.angle/Math.PI)*180
    p.turret.rotation = (p.turretAngle/Math.PI)*180 + 90
    p.flash.rotation = (p.turretAngle/Math.PI)*180 + 90
    p.shape.x = p.origin[0]
    p.shape.y = p.origin[1]

  }
}

view.add(tankView)
