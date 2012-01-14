
function createRock(origin) {
  return {
    type: 'rock',
    origin: origin ? new Vector(origin) : randomOrigin(),
    name: 'rock',
    radius: 24
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
view.add(rockView)