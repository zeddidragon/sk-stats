;(function () {
  if(!Elm.Main) return runElmProgram()

  var app = Elm.Main.fullscreen(
    { qs: window.location.search
    , path: window.location.href
    })
  var clippy = new Clipboard(".clipboard")

  app.ports.lsSave.subscribe(function(pair) {
    localStorage[pair[0]] = pair[1]
    sendData()
  })

  function sendData() {
    app.ports.lsData.send(Object.keys(localStorage).map(function(k) {
      return [k, localStorage[k]]
    }))
  }

  sendData()
})();
