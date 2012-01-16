
var lastTick = Date.now()

function World () { }
World.prototype = {
  addClass: function (name, constructor) {
    //call the constructor function and add the result to the world...
    this['create'+name] = function () {
      var l = arguments.length
      var args = new Array(l)
      while (l--) args[l] = arguments[l]
      var n = {}
      return this.add(constructor.apply(n, args) || n)
    }
  },
  add: function (thing) {
    if(!thing)
      throw new Error('cannot add null thing to world')
    if(this.things.indexOf(thing) !== -1)
      return
    
    this.things.push(thing)
    callif(this.onadd, [thing])
    return thing
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


function View (world, stage) {
  this._world = world
  this._stage = stage
  this.viewers = {
    default: {
      init: function (thing, stage) {

        var g = new Graphics()
        var green = Graphics.getRGB( 0, 255, 0 )

        g.setStrokeStyle( 1 );
        g.beginStroke( green );
        g.drawCircle(0, 0, thing.radius)

        thing.shape = new Container()
        thing.shape.addChild(new Shape(g))
        thing.shape.addChild(new Text(thing.type, '10px courier', green ))
        thing.shape.x = thing.origin.x
        thing.shape.y = thing.origin.y
        
        stage.ground.addChild(thing.shape)      
      },
      update: function (thing) {
        thing.shape.visible = thing.visible
      }
    }
  }
}
View.prototype = {
  add: function (viewer) {
    this.viewers[viewer.type] = viewer
  },
  rm: function (thing) {
    if(!thing.type)
      throw new Error('viewable objects must have types')
    var viewer = this.viewers[thing.type] || this.viewers.default
    if(!viewer)
      throw new Error('must register viewer for type='+thing.type)
    callif(viewer.rm, viewer, [thing, stage])
  },
  init: function (thing) {

    if(!thing.type) {
      console.log(thing)
      throw new Error('viewable objects must have types')
    }
    if(!this.viewers)
      console.log(this)
    var viewer = this.viewers[thing.type] || this.viewers.default
    if(!viewer)
      throw new Error('must register viewer for type='+thing.type)
    viewer.init(thing, this._stage)
  },
  tick: function () {
    var view = this
    each(this._world.things, function (thing) {
      var viewer = view.viewers[thing.type] || view.viewers.default
      if(viewer) callif(viewer.update, viewer, [thing])
    })
  },
  sprites: {},
  _spritesToLoad: 0
}
