(function () {
  "use strict"

  var helper = {
    turnOff: function (elements) {
      elements.forEach(function (el) {
        el.classList.remove('active')
      })
    },
    qs: function (el) {
      return document.querySelector(el)
    },
    qsa: function (el) {
      return document.querySelectorAll(el)
    }
  }

  var app = {
    key: 'fakekey',
    format: 'json',
    artist: 'Rembrandt+van+Rijn',
    results: 10,
    page: 1,
    imageOnly: true,
    url: function () {
      return 'https://www.rijksmuseum.nl/api/nl/collection/?key=' + this.key + '&format=' + this.format + '&principalMaker=' + this.artist + '&ps=' + this.results + '&p=' + this.page + '&imgonly=' + this.imageOnly
    },
    init: function () {
      var request = new XMLHttpRequest()
      request.open('GET', this.url(), true)

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText)
          Transparency.render(helper.qs('#home'), sections.home(data))
          console.log(data)
        } else {
          console.log('Error...')
        }
      }

      request.onerror = function () {
        console.log('Error... (onerror)')
      }

      request.send()
    }
  }

  var sections = {
    toggle: function (route) {
      var activeElements = helper.qsa('.active')
      var activeLinkElements = helper.qsa('nav [href="' + route + '"]')
      var sectionElements = helper.qs(route)

      helper.turnOff(activeElements)
      activeLinkElements.length > 0 && activeLinkElements[0].classList.add('active')
      sectionElements.classList.add('active')
    },
    home: function (i) {
      return {
        name: 'world!',
        about: 'Hij is iemand.',
        info: i.count
      }
    }
  }

  var router = {
    init: routie({
      'home': function () {
        sections.toggle('#home')
      },
      'werken': function () {
        sections.toggle('#werken')
      },
      'detail': function () {
        sections.toggle('#detail')
      },
      '': function () {
        sections.toggle('#home')
      },
      '*': function () {
        sections.toggle('#error')
      }
    })
  }

  app.init()

})()