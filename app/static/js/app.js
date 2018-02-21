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
      utils.showSettings()
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
          api.getData(api.language + '/collection/?principalMaker=' + api.artistCollection + '&ps=' + api.results + '&p=' + api.page + '&').then(function (data) {
            template.render(data, '#werken', template.werken)
          }).then(function () {
            utils.onScroll()
          })
        },
        'detail/:id': function (id) {
          sections.toggle('#detail')
          api.getData(api.language + '/collection/' + id + '?').then(function (data) {
            template.render(data, '#detail', template.detail)
          }).catch(function () {
            routie('error')
          })
        },
        'detail/image/:id': function (id) {
          sections.toggle('#image')
          api.getData(api.language + '/collection/' + id + '?').then(function (data) {
            template.render(data, '#image', template.image)
          }).catch(function () {
            routie('error')
          })
        },
        // Routes automatically to home when there is no #
        '': function () {
          routie('home')
        },
        // Fallback when the # is different than above
        '*': function () {
          routie('error')
        },
        'error': function () {
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
    // artistCollection: 'Vincent+van+Gogh',
    artistInfo: 'rembrandt-van-rijn',
    // artistInfo: 'johannes-vermeer',
    // artistInfo: 'vincent-van-gogh',
    results: 10,
    page: 1,
    language: '/nl',

    // Gets data from api with an url that is specified above and in the route
    getData: function (dataEndpoint) {
      // localStorage.clear()
      return new Promise(function (resolve, reject) {
        if (localStorage.getItem(dataEndpoint)) {
          console.log('localStorage')
          var data = JSON.parse(localStorage.getItem(dataEndpoint))
          if (data) {
            resolve(data)
          } else {
            reject(error)
          }

        } else {
          console.log('request')
          api.requestData(resolve, reject, dataEndpoint)

        }
      })
    },
    requestData: function (resolve, reject, dataEndpoint) {
      var request = new XMLHttpRequest()
      request.open('GET', api.url + dataEndpoint + 'key=' + config.key + '&format=' + api.format, true)

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          // Gets data and resolves and rejects if error
          var data = JSON.parse(request.responseText)
          localStorage.setItem(dataEndpoint, JSON.stringify(data))
          return resolve(data)
        } else {
          return reject(error)
        }
      }

      request.onerror = function () {
        console.log('error... (onerror)')
      }

      request.send()

    }
  }

  var sections = { 
    // Toggles the right section and adds active states
    toggle: function (route) {
      var activeElements = document.querySelectorAll('.active'),
          activeLinkElements = document.querySelectorAll('nav [href="' + route + '"]'),
          sectionElements = document.querySelector(route)
      // Turns active links off and adds the right active state
      this.hideSection(activeElements)
      this.showSection(activeLinkElements, sectionElements) 
    },
    hideSection: function (elements) {
      elements.forEach(function (element) {
        element.classList.remove('active')
        if (element.nodeName === "SECTION") {
            window.setTimeout(function () {
                element.classList.add('hidden')
            }, 300);
        }
      })
    },
    showSection: function (link, element) {
      if (link.length > 0) {
        link[0].classList.add('active')
      } 
      element.classList.remove('hidden')
      window.setTimeout(function () {
        element.classList.add('active')
      }, 1);
    }
  }

  var template = {
    // Renders the template in the HTML page
    render: function (data, route, template) {
      // Gets the render and adds the parameters added in the call
      Transparency.render(document.querySelector(route), template(data), this.renderDirectives())
    },
    // Shows the right data for the right page
    home: function (data) {
      console.log(data)
      return {
        name: data.contentPage.title,
        about: data.contentPage.body.html,
      }
    },
    werken: function (data) {
      var works = data.artObjects.filter(function (data) {
        return data.webImage !== null
      }).map(function (item) {
        return {
          title: item.title,
          imageUrl: item.webImage.url,
          id: item.objectNumber
        }
      })
      return works 
    },
    detail: function (data) {
      console.log(data)
      return {
        title: data.artObject.title,
        imageUrl: data.artObject.webImage.url,
        description: data.artObject.description,
        id: 'image/' + data.artObjectPage.objectNumber
      }
    },
    image: function (data) {
      console.log(data)
      return {
        imageUrl: data.artObject.webImage.url
      }
    },
    // This gets all images and or links and adds the right url to it. Only when it finds it on the page
    renderDirectives: function () {
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
        },
        info: {
          html: function (params) {
            return this.about
          }
        }
      }
      return directives
    }
  }
  
  var utils = {
    onScroll: function () {
      var lastScrollTop = 0;
      window.addEventListener("scroll", function () { 
         var st = window.pageYOffset || document.documentElement.scrollTop;
         if (st == lastScrollTop) {
          document.querySelectorAll('.smallImage').forEach(function (image) {
            image.classList.remove('up')
             image.classList.remove('down')
          })
         } else if (st > lastScrollTop) {
           document.querySelectorAll('.smallImage').forEach(function (image) {
             image.classList.remove('up')
              image.classList.add('down')
              window.setTimeout(function () {
                image.classList.remove('down')
              }, 500)
           })
         } else {
          document.querySelectorAll('.smallImage').forEach(function (image) {
            image.classList.remove('down')
             image.classList.add('up')
             window.setTimeout(function () {
              image.classList.remove('up')
            }, 500)
          })
         }
         lastScrollTop = st;
      })
    },
    showSettings: function () {
      document.querySelector('aside svg').addEventListener('click', function () {
        document.querySelector('aside article').classList.toggle('active')
        utils.userSettings()
      })
    },
    userSettings: function () {
      document.querySelectorAll('.userSettings li').forEach(function (element) {
        element.addEventListener('click', function () {
          console.log(this)
        })
      })
    }
  }

  app.init()

})()