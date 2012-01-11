/* player behaviour*/

function createPlayer (name, origin) {
  return {
    name: name,
    origin:   origin || [ 100, 100],
    velocity: [ 0, 0 ],
    angle: Math.PI*-0.5,
    turretAngle: Math.PI*-0.5,
    facing: a2v(Math.PI*1), // or as angle?
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
      //calculate angle to other object, and bump away from it.
      //reduce speed by the dot product of the facing
      //
      var dir = normalize(subtractVectors(this.origin, other.origin))
      var d = dot(dir, this.facing)
      console.error('TOUCH', this.name, d, dir)          
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


function drawPlayer (p, sprites) {

  /*var g=new Graphics()
  g.beginStroke(Graphics.getRGB(0,255,0));
  g.drawCircle(0,0, p.r)
  g.moveTo(0,0)
  */

  var hull = new Bitmap(sprites.hull)
  var turret = new Bitmap(sprites.turret)
  var flash = new Bitmap(sprites.flash)

  //g.beginBitmapStroke(hull.image)
  //ahh, it hasn't loaded yet

  hull.regX = 32;
  hull.regY = 32;
  hull.rotation = 90

  copyTo(flash, copyTo(turret, {
    x:0,
    regX: 32,
    regY: 34,
    rotation: 90      
  }))

  p.turret = turret
  p.flash = flash
  p.facing = a2v(p.angle)

  /*
  g.lineTo(p.r * 2, 0)
  g.moveTo(p.l, p.w)
  g.lineTo(p.l * -1, p.w)
  g.lineTo(p.l * -1, p.w * -1)
  g.lineTo(p.l, p.w * -1)
  g.lineTo(p.l, p.w)
  */
  p.shape = new Container()
  p.shape.addChild(hull)//new Shape(g)
  p.shape.addChild(turret)//new Shape(g)
  p.shape.addChild(flash)//new Shape(g)
  flash.visible = false

  //split this into motion and drawing.
  //so that motion is decoupled from drawing.
  p.update = function () {

    p.shape.rotation = (p.angle/Math.PI)*180
    p.turret.rotation = (p.turretAngle/Math.PI)*180
    p.flash.rotation = (p.turretAngle/Math.PI)*180
    p.shape.x = p.origin[0]
    p.shape.y = p.origin[1]
    
  }
  p.move(0, Date.now()/1000)
  p.update()
  stage.addChild(p.shape)
}
