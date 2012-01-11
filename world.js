
var lastTick = Date.now()

var world = {
  add: function (thing) {
    if(this.things.indexOf(thing) != -1)
      this.things.push(thing)
  },
  rm: function (thing) {
    var index = this.things.indexOf(thing)
    this.things.splice(index)
  },
  tick: function () {
    var now = Date.now()/1000
    var slice = (now - lastTick)
  
    //detect collisions
    //iterate over each handshaking pair, without shaking your own hand.
    handshake(this.things, function (a, b) {

      //this will have querks at the side of the screen.
      //need to check dohnut distance.

      var dist = vectorLength(diffVectors(a.origin, b.origin))
      if(dist < (a.radius + b.radius)) {
      //how is best to handle collisions?
      //if something is moving, and something else blocks it, 
      //then can't move into it. 
      //also, handle N way collisions without getting stuck.
        if('function' == typeof a.touch) a.touch(b)
        if('function' == typeof b.touch) b.touch(a)
      }
    })

    things.forEach(function (t) { 
      if('function' == typeof t.move) 
        t.move(slice, now) 
    })
    things.forEach(function (t) {
      if('function' == typeof t.update) t.update()
    })

    lastTick = now
    stage.update()
  },
  things: []
}
  
Ticker.setFPS( 10 );
Ticker.addListener( world );
