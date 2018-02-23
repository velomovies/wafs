import config from './config.js'
import sections from './sections.js'
import api from './api.js'
import template from './template.js'
import utils from './utils.js'

const router = {
  init: function () { 
    // Checks with routie which section it has to show
    routie({
      'home': function () {
        // Toggles section and gets data from api. Parameter for the right data endpoint
        sections.toggle('#home')
        api.getData(`/pages${config.language}/rijksstudio/kunstenaars/${config.artistInfo()}?`)
        .then(function (data) {
          // Renders the right data with a few parameters to show the right content
          template.render(data, '#home', template.home)
        })
        .then(function () {
          // Delete loader when all data is loaded 
          utils.deleteLoader()
        })
        .catch(function () {
          //When there is an error somewhere in the promise, render the error page
          routie('error')
        })
      },
      'art': function () {
        api.getData(`${config.language}/collection/?principalMaker=${config.artistCollection()}&ps=${config.results}&p=${config.page}&`)
        .then(function (data) {
          template.render(data, '#art', template.art)
        })
        .then(function () {
          sections.toggle('#art')
        })
        .then(function () {
          utils.onScroll()
          utils.deleteLoader()
        })
        .catch(function () {
          routie('error')
        })
      },
      'detail/:id': function (id) {
        api.getData(`${config.language}/collection/${id}?`)
        .then(function (data) {
          template.render(data, '#detail', template.detail)
        })
        .then(function () {
          sections.toggle('#detail')
        })
        .then(function () {
          utils.deleteLoader()
        })
        .catch(function () {
          routie('error')
        })
      },
      'detail/image/:id': function (id) {
        sections.toggle('#image')
        api.getData(`${config.language}/collection/${id}?`)
        .then(function (data) {
          template.render(data, '#image', template.image)
        })
        .then(function () {
          utils.deleteLoader()
        })
        .catch(function () {
          routie('error')
        })
      },
      // renders the error page
      'error': function () {
        sections.toggle('#error')
      },
      'refresh': function () {
        routie('home')
      },
      // Routes automatically to home when there is no #
      '': function () {
        routie('home')
      },
      // Fallback when the # is different than above
      '*': function () {
        routie('error')
      }
    })
  }
}

export default router