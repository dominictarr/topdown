
var lastTick = Date.now()

var world = {
  add: function (thing) {
    if(!thing)
      throw new Error('cannot add null thing to world')
    if(this.things.indexOf(thing) !== -1)
      return
    
    this.things.push(thing)
    callif(this.onadd, [thing])
    return this
  },
  rm: function (thing) {
    var index = this.things.indexOf(thing)
    if(index == -1) return
    var thing = this.things[index]
    this.things.splice(index, 1) //MUST pass second argument
    callif(this.onrm, [thing])
  },
  //iterate over all game objects within a circle
  near: function (center, radius, iterator) {
    each(this.things, function (thing) {
      var dist = center.diff(thing.origin).length()
//      vectorLength(diffVectors(center, thing.origin))
      if(dist < radius) iterator(thing, dist)    
    })  
  },
  tick: function () {
    var now = Date.now()/1000
    var slice = (now - lastTick)
    
    //detect collisions
    handshake(this.things, function (a, b) {

      //this will have querks at the side of the screen.
      //need to check dohnut distance.

      var dist = a.origin.diff(b.origin).length()
      if(dist < (a.radius + b.radius)) {
        //how is best to handle collisions?
        //if something is moving, and something else blocks it, 
        //then can't move into it. 
        //also, handle N way collisions without getting stuck.

        callif(a.touch, a, [b])
        callif(b.touch, b, [a])
      }
    })

    this.things.forEach(function (t) { 
      callif(t.move, t, [slice, now])
    })
    callif(this.ontick, [])
    this.things.forEach(function (t) {
      callif(t.update, t, [])
    })
  
    lastTick = now
    stage.update()
  },
  things: [],
  onadd: function (){},
  onrm: function (){}
}


var view = {
  add: function (viewer) {
    view.viewers[viewer.type] = viewer
  },
  rm: function (thing) {
    if(!thing.type)
      throw new Error('viewable objects must have types')
    var viewer = view.viewers[thing.type]
    if(!viewer)
      throw new Error('must register viewer for type='+thing.type)
    callif(viewer.rm, viewer, [thing])
  },
  init: function (thing) {
    if(!thing.type)
      throw new Error('viewable objects must have types')
    var viewer = view.viewers[thing.type]
    if(!viewer)
      throw new Error('must register viewer for type='+thing.type)
    viewer.init(thing)
  },
  tick: function () {
    each(world.things, function (thing) {
      var viewer = view.viewers[thing.type]
      if(viewer)
        callif(viewer.update, viewer, [thing])
    })
  },
  viewers: {},
  sprites: {},
  _spritesToLoad: 0
}

world.onadd   = view.init
world.onrm    = view.rm
world.ontick  = view.tick
