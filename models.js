/* player behaviour*/

function model (world) {

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
      maxSpeed: TANK_MAXSPEED,
      health: TANK_HEALTH,
      speed: 0,
      acceleration: TANK_ACCEL,
      deacceleration: TANK_DECEL,
      touch: function (other) {

        if(other.type == 'missile') //solid?
          return

        //calculate angle to other object, and bump away from it.
        //reduce speed by the dot product of the facing
        var d = this.origin.sub(other.origin).inor().dot(this.facing)
        if(d*this.speed < 0)
          this.speed = d*TANK_BOUNCE
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
        p.angle += Math.PI*-1*TANK_TURN*(p.turn || 0)*slice
        p.turretAngle += Math.PI*-1*TURRET_TURN*(p.rotate || 0)*slice

        assert(!isNaN(p.angle), "NaN angle")
        p.fired = false
        if(p.fire && (!p.reload || p.reload < time)) {
          p.reload = time + TANK_RELOAD
          p.fired = true
          world.add(createMissile(this)) 
        } 
      
        p.facing = Vector.a2v(p.angle)
        p.speed += (p.accelerate) * p.acceleration * slice

        if(!p.accelerate) {
          p.speed -= p.speed/TANK_DECEL*slice
          if(p.speed < 0) p.speed = 0
        }

        if(p.speed > p.maxSpeed)      p.speed = p.maxSpeed
        if(p.speed < p.maxSpeed * -1) p.speed = p.maxSpeed * -1
    
        p.origin.iadd(p.facing.mul(p.speed * slice))

        var wm = 0, wM = canvas.width, hm = 0, hM = canvas.height

        if(p.origin.x < wm)  p.origin.x = wM
        if(p.origin.y < hm)  p.origin.y = hM
        if(p.origin.x > wM)  p.origin.x = wm
        if(p.origin.y > hM)  p.origin.y = hm
      }
    }
  }

  function createMissile(parent) {
    var f = Vector.a2v(parent.turretAngle + parent.angle)
    var velocity = f.mul(CANNON_SPEED)
    var o = new Vector(parent.origin).iadd(velocity)
    return {
      type: 'missile',
      parent: parent,
      origin: o,
      velocity: velocity,
      facing: f,
      radius: 2,
      hit: 0,
      name: 'missile',
      move: function (slice) {
        this.origin.iadd(this.velocity)

        var wm = 0, wM = canvas.width, hm = 0, hM = canvas.height
        if(this.origin.x < wm || this.origin.y < hm || this.origin.x > wM || this.origin.y > hM)
          world.rm(this) //has left the game board
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
      }
    }
  }

  function createRock(origin) {
    return {
      type: 'rock',
      origin: origin ? new Vector(origin) : randomOrigin(),
      name: 'rock',
      radius: 24
    }
  }

  return {
    createTank: createTank,
    createMissile: createMissile,
    createRock: createRock
    }
}