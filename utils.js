function randomOrigin() {
  return new Vector(Math.random() * 1024, Math.random() * 600)
}

function assert (test, message) {
  if(!test) throw new Error(message)
}

function callif(func, recv, args) {
  if(!args) args = recv
  if('function' == typeof func) return func.apply(recv, args || [])
}

function copyTo(to, from) {
  for (var p in from) {
    to[p] = from[p]
  }
  return from
}

//iterate over each handshaking pair, without shaking your own hand.
function handshake (things, iterator) {
  for(var i = 0; i < things.length; i ++) {
    for(var j = i + 1; j < things.length; j ++)
      iterator (things[i], things[j])
  }
}

function each(things, iterator) {
  for (var i in things) {
    iterator(things[i], i, things)
  }
}
