
function createRock(origin) {
  return {
    origin: origin || randomOrigin(),
    name: 'rock',
    radius: 24
  }
}

function drawRock(rock) {

  var img = new Bitmap(document.getElementById('rock'))
  rock.shape = img
  img.regX = 32;
  img.regY = 32;

  img.x = rock.origin[0]
  img.y = rock.origin[1]
  stage.addChild(img)

}
