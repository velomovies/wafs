// Uses routie by Greg Allen (http://projects.jga.me/routie/) for routing 
// &
// Uses transparancy by Leonidas (http://leonidas.github.com/transparency/) for templating

(function () {
  "use strict"

  var app = {
    init: function () {
      // Initialize the app and start router
      router.init()
    }
  }

  var router = {
    init: function () { 
      // Checks with routie which section it has to show
      routie({
        'home': function () {
          // Toggles section and gets data from api. Parameter for the right data endpoint
          sections.toggle('#home')
          api.getData('/pages' + api.language + '/rijksstudio/kunstenaars/' + api.artistInfo + '?').then(function (data) {
            // Renders the right data with a few parameters to show the right content
            template.render(data, '#home', template.home)
          }) 
        },
        'werken': function () {
          sections.toggle('#werken')
          api.getData(api.language + '/collection/?principalMaker=' + api.artistCollection + '&ps=' + api.results + '&p=' + api.page + '&imgonly=' + api.imageOnly + '&').then(function (data) {
            template.render(data, '#werken', template.werken)
          }) 
        },
        'detail/:id': function (id) {
          sections.toggle('#detail')
          api.getData(api.language + '/collection/' + id + '?').then(function (data) {
            template.render(data, '#detail', template.detail)
          })
        },
        // Routes automatically to home when there is no #
        '': function () {
          routie('home')
        },
        // Fallback when the # is different than above
        '*': function () {
          sections.toggle('#error')
        }
      })
    }
  }

  var api = {
    // A config for showing the right data
    url: 'https://www.rijksmuseum.nl/api',
    format: 'json',
    artistCollection: 'Rembrandt+van+Rijn',
    // artistCollection: 'Johannes+Vermeer',
    artistInfo: 'rembrandt-van-rijn',
    // artistInfo: 'johannes-vermeer',
    results: 10,
    page: 1,
    imageOnly: true,
    language: '/nl',

    // Gets data from api with an url that is specified above and in the route
    getData: function (dataEndpoint) {
      var loadData = new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', api.url + dataEndpoint + 'key=' + config.key + '&format=' + api.format, true)
    
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            // Gets data and resolves and rejects if error
            var data = JSON.parse(request.responseText);
            resolve(data)
          } else {
            reject(error)
          }
        }
    
        request.onerror = function () {
          console.log('error... (onerror)')
        }
    
        request.send()
      })
      // It returns loadData so i can make a 'then' immediately in the route
      return loadData;
    }
  }

  var sections = {
    // Toggles the right section and adds active states
    toggle: function (route) {
      var activeElements = helper.qsa('.active'),
          activeLinkElements = helper.qsa('nav [href="' + route + '"]'),
          sectionElements = helper.qs(route)
      // Turns active links off and adds the right active state
      helper.turnOff(activeElements)
      activeLinkElements.length > 0 && activeLinkElements[0].classList.add('active')
      sectionElements.classList.remove('hidden')
      sectionElements.classList.add('active')
    }
  }

  var template = {
    // Renders the template in the HTML page
    render: function (data, route, template) {
      // Gets the render and adds the parameters added in the call
      Transparency.render(helper.qs(route), template(data), this.directivesMethod())
    },
    // Shows the right data for the right page
    home: function (data) {
      return {
        name: data.contentPage.title,
        about: 'Hij is iemand.',
        info: 'info'
      }
    },
    werken: function (data) {
      var works = data.artObjects.map(function (item) {
        return {
          title: item.title,
          imageUrl: item.webImage.url,
          id: item.objectNumber
        }
      })
      return works 
    },
    detail: function (data) {
      return {
        title: data.artObject.title,
        imageUrl: data.artObject.webImage.url
      }
    },
    // This gets all images and or links and adds the right url to it. Only when it finds it on the page
    directivesMethod: function () {
      var directives = {
        image: {
          src: function (params) {
            return this.imageUrl
          }
        },
        link: {
          href: function (params) {
            return '#detail/' + this.id
          }
        }
      }
      return directives
    }
  }


  var helper = {
    // An helper to instantly remove any active classes on elements and a smaller way to use querySelector and querySelectorAll
    turnOff: function (elements) {
      elements.forEach(function (el) {
        el.classList.remove('active')
        if (el.nodeName === "SECTION") {
            window.setTimeout(function () {
                el.classList.add('hidden')
            }, 300);
        }
      })
    },
    qs: function (el) {
      return document.querySelector(el)
    },
    qsa: function (el) {
      return document.querySelectorAll(el)
    }
  }

  app.init()

})()