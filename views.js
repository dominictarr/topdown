
function viewers (view, stage) {

  function image(id) {
    return document.getElementById(id)
  }

  //add stuff to load the sprites
  var turretFrames = { width: 64, height: 64, count: 12, regX: 32, regY: 32 }
  var turretAni = { 
    fire: {frames: [0, 1], next: 'ready'},
    ready: [10, 10, false]
  }
  var tankView = {
    type: 'tank',
    sprites: {
      green_hull  : new Bitmap('images/green_hull.png'),
      green_turret: new BitmapAnimation(new SpriteSheet({
      images: ['images/green_turret_sheet.png'],
      frames: turretFrames,
      animations: turretAni
      })),
      brown_hull  : new Bitmap('images/brown_hull.png'),
      brown_turret: new BitmapAnimation(new SpriteSheet({
        images: ['images/brown_turret_sheet.png'],
        frames: turretFrames,
        animations: turretAni
        })),
    },
    init: function (p) {
      if(p.shape)
        throw new Error('already initialized tank')
    
      function s(part) {
        return tankView.sprites[p.name+'_' + part].clone()
      }

      var hull    = s('hull')
      var turret  = s('turret')
      hull.regX = 32;
      hull.regY = 32;
      hull.rotation = 90

      p.turret = turret
      p.turret.gotoAndStop('ready')
      p.facing = Vector.a2v(p.angle)

      p.shape = new Container()
      p.shape.addChild(hull)
      p.shape.addChild(turret)

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
      if(p.fired) p.turret.gotoAndPlay('fire')

      p.shape.rotation  = (p.angle/Math.PI)*180
      p.turret.rotation = (p.turretAngle/Math.PI)*180 + 90
      p.shape.x = p.origin.x
      p.shape.y = p.origin.y    
    }
  }


  var missileView = {
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
  }

  var rockView = {
    type: 'rock',
    sprites: {rock: new Bitmap('images/obstacle_rock.png')},
    init: function (rock) {

      var img = this.sprites.rock.clone()
      rock.shape = img
      img.regX = 32;
      img.regY = 32;

      img.x = rock.origin.x
      img.y = rock.origin.y
      stage.ground.addChild(img)
    }
  }

 view.add(missileView)
 view.add(tankView)
 view.add(rockView)

}