// Uses routie by Greg Allen (http://projects.jga.me/routie/) for routing 
// &
// Uses transparancy by Leonidas (http://leonidas.github.com/transparency/) for templating

import utils from './modules/utils.js'
import router from './modules/router.js'

(function () {
  "use strict"

  const app = {
    init: function () {
      // Initialize the app and start router
      router.init()
      utils.showSettings()
    } 
  }

  app.init()

}) ()