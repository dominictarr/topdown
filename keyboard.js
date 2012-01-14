    function createListener(listeners) {
      listeners = listeners || [] 
      var listener = function (event) {
      var f = true
        listeners.forEach(function (e) {
          if(e(event) === false) f = false
        })
        return f;
      }
      listener.remove = function (item) {
        var i = listeners.indexOf(item)
        if(i === -1) return
        listeners.splice(i,1)
      }
      listener.listeners = listeners
      return listener
    }

    function createKBHandler (schema, _pairs, actor) {
      //add thing to handle multiple listeners...
      //   ... later
      for (var key in schema) {
        actor[schema[key]] = 0
      }
      var pairs = {}
      for (var keys in _pairs) {
        var target = _pairs[keys]
          , split = keys.split(',')
          , up = split[0], down = split[1]
        pairs[down] = pairs[up]   = {target: target, up: up, down: down}
        actor[target] = 0
      }

      return function (ke) {
        var dir = (ke.type == 'keydown' ? 1 : 0)
        var key = schema[ke.which]
        if(key) { 
          actor[key] = dir; 
          if(pairs[key]) {
            var p = pairs[key]
            actor[p.target] = actor[p.up] - actor[p.down]
          } 

          return false
        }
      }
    }
