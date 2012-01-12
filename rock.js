
function createRock(origin) {
  return {
    type: 'rock',
    origin: origin || randomOrigin(),
    name: 'rock',
    radius: 24
  }
}
var rockView = {
  type: 'rock',
  useSprites: {rock: 'images/obstacle_rock.png'},
  init: function (rock) {
    var img = new Bitmap(this.sprites.rock)
    rock.shape = img
    img.regX = 32;
    img.regY = 32;

    img.x = rock.origin[0]
    img.y = rock.origin[1]
    stage.addChild(img)
  }
}
view.add(rockView)