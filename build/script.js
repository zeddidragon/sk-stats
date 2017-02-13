;(function () {
  if(!Elm.Main) return runElmProgram()

  var app = Elm.Main.fullscreen(
    { qs: window.location.search
    , path: window.location.href.split("?")[0]
    , left: localStorage.left || ""
    , right: localStorage.right || ""
    , leftName: localStorage.leftName || null
    , rightName: localStorage.rightName || null
    })
  var clippy = new Clipboard(".clipboard")

  app.ports.lsSave.subscribe(function(pairs) {
    pairs.forEach(function(pair) {
      localStorage[pair[0]] = pair[1]
    })
    sendData()
  })

  function sendData() {
    app.ports.lsData.send(Object.keys(localStorage).map(function(k) {
      return [k, localStorage[k]]
    }))
  }

  sendData()
})();
