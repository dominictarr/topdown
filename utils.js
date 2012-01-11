function randomOrigin() {
  return [Math.random() * 1024, Math.random() * 600] 
}

function addToVector (a, b, x) {
  var l = 2
  while (l--) a[l] += ((+b[l] || 0) * ('number' == typeof x ? x : 1))
  return a
}

function diffVectors (a, b) {
  var l = 2
  var d = new Array(2)      
  while (l--) {
    //TODO: take into account donut worldness (torus)
    var _a = (+a[l] || 0), _b = (+b[l] || 0)
    d[l] = Math.max(_a,_b) - Math.min(_a,_b)
  }
  return d
}

function normalize (a) {
  var l = vectorLength(a)
  a[0] = a[0]/l
  a[1] = a[1]/l
  return a
}

function dot (a,b) {
  return a[0] * b[0] + a[1]* b[1]
}

function subtractVectors (a, b) {
  var l = 2
  var d = new Array(2)      
  while (l--) {
    //TODO: take into account donut worldness (torus)
    d[l] = (+a[l] || 0) - (+b[l] || 0)
  }
  return d
}

//convert a unit vector into an angle in radians.
function a2v (a) { return [Math.cos(a), Math.sin(a)] }
//convert an angle in radians to a unit vector.
function v2a (v) { return Math.atan(v[0]/v[1]) * (v[1] > 0 ? 1 : -1 ) }

function assert(test, message) {
  if(!test) throw new Error(message)
}

function vectorLength(v) {
  var s = 0, l = 2
  while (l--) s += Math.pow(v[l],2)
  return Math.sqrt(s)
}

  function copyTo(to, from) {
    for (var p in from) {
      to[p] = from[p]
    }
    return from
  }

function handshake (things, iterator) {
  for(var i = 0; i < things.length; i ++) {
    for(var j = i + 1; j < things.length; j ++)
      iterator (things[i], things[j])
  }
}
