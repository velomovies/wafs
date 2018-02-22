// Uses routie by Greg Allen (http://projects.jga.me/routie/) for routing 
// &
// Uses transparancy by Leonidas (http://leonidas.github.com/transparency/) for templating

(function () {
  "use strict"

  var app = {
    init: function () {
      // Initialize the app and start router
      router.init()
      utils.showSettings()
    } 
  }

  var router = {
    init: function () { 
      // Checks with routie which section it has to show
      routie({
        'home': function () {
          // Toggles section and gets data from api. Parameter for the right data endpoint
          sections.toggle('#home')
          api.getData('/pages' + api.language + '/rijksstudio/kunstenaars/' + api.artistInfo() + '?')
          .then(function (data) {
            // Renders the right data with a few parameters to show the right content
            template.render(data, '#home', template.home)
          })
          .catch(function () {
            routie('error')
          })
        },
        'art': function () {
          sections.toggle('#art')
          api.getData(api.language + '/collection/?principalMaker=' + api.artistCollection() + '&ps=' + api.results + '&p=' + api.page + '&')
          .then(function (data) {
            template.render(data, '#art', template.art)
          })
          .then(function () {
            utils.onScroll()
          })
          .catch(function () {
            routie('error')
          })
        },
        'detail/:id': function (id) {
          sections.toggle('#detail')
          api.getData(api.language + '/collection/' + id + '?')
          .then(function (data) {
            template.render(data, '#detail', template.detail)
          })
          .catch(function () {
            routie('error')
          })
        },
        'detail/image/:id': function (id) {
          sections.toggle('#image')
          api.getData(api.language + '/collection/' + id + '?')
          .then(function (data) {
            template.render(data, '#image', template.image)
          })
          .catch(function () {
            routie('error')
          })
        },
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

  var api = {
    // A config for showing the right data
    url: 'https://www.rijksmuseum.nl/api',
    format: 'json',
    artistCollection: function () {
      if (localStorage.getItem('artistCollection')) {
        return localStorage.getItem('artistCollection')
      } else {
        return 'Rembrandt+van+Rijn' 
      }
    },
    artistInfo: function () {
      if (localStorage.getItem('artistInfo')) {
        return localStorage.getItem('artistInfo')
      } else {
        return 'rembrandt-van-rijn' 
      }
    },
    results: 100,
    page: 1,
    language: '/nl',
    refresh: true,

    // Gets data from api with an url that is specified above and in the route
    getData: function (dataEndpoint) {
      // Uncomment if nothing has to be stored
      localStorage.clear()
      return new Promise(function (resolve, reject) {
        if (localStorage.getItem(dataEndpoint)) {
          var data = JSON.parse(localStorage.getItem(dataEndpoint))
          if (data) {
            resolve(data)
          } else {
            reject(error)
          }

        } else {
          api.requestData(resolve, reject, dataEndpoint)
        }
      })
    },
    requestData: function (resolve, reject, dataEndpoint) {
      var request = new XMLHttpRequest()
      
      request.open('GET', api.url + dataEndpoint + 'key=' + config.key + '&format=' + api.format, true)
      console.log(api.url + dataEndpoint + 'key=' + config.key + '&format=' + api.format)
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
        routie('#error')
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
        if (element.nodeName === 'SECTION' && api.refresh) {
          window.setTimeout(function () {
              element.classList.add('hidden')
          }, 300);
        }
        api.refresh = true
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
      return {
        name: data.contentPage.title,
        about: data.contentPage.body.html,
      }
    },
    art: function (data) {
      var dataArt = data.artObjects
      .filter(function (data) {
        return data.webImage !== null
      })
      .map(function (item) {
        return {
          title: item.title,
          imageUrl: item.webImage.url,
          id: item.objectNumber
        }
      })
      return dataArt 
    },
    detail: function (data) {
      return {
        title: data.artObject.title,
        imageUrl: data.artObject.webImage.url,
        description: data.artObject.description,
        id: 'image/' + data.artObjectPage.objectNumber
      }
    },
    image: function (data) {
      return {
        imageUrl: data.artObject.webImage.url
      }
    },
    selectArtist: function (data) {
      var artistNames = data.contentPage.highlights
      .map(function (item) {
        return {
          artistName: item.page.title
        }
      })
      return artistNames
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
      var lastScrollTop = 0
      var smallImages = document.querySelectorAll('.smallImage')

      window.addEventListener("scroll", function () {
        var st = window.pageYOffset || document.documentElement.scrollTop

        if (st > lastScrollTop) {
          smallImages.forEach(function (image) {
            image.classList.remove('up')
            image.classList.add('down')
            window.setTimeout(function () {
              image.classList.remove('down')
            }, 500)
          })
        } else {
          smallImages.forEach(function (image) {
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
      this.selectArtist()
      document.querySelector('aside svg').addEventListener('click', function () {
        document.querySelector('aside article').classList.toggle('active')
      })
    },
    selectArtist: function () {
      api.getData('/pages' + api.language + '/rijksstudio/kunstenaars/?')
      .then(function (data) {
        // Renders the right data with a few parameters to show the right content
          template.render(data, '#selectArtist', template.selectArtist)
      })
      .then(function () {
        document.querySelectorAll('.selectArtist li').forEach(function (element) {
          element.addEventListener('click', function () {
            var artist = this.innerText,
                namePlus = artist.replace(/ /g, '+'),
                nameLow = artist.toLowerCase(),
                nameMinus = nameLow.replace(/ /g, '-'),
                nameArtistInfo = nameMinus.split('.').join('')
            localStorage.setItem('artistCollection', namePlus)
            localStorage.setItem('artistInfo', nameArtistInfo)
            if(location.hash == '#home') {
              api.refresh = false
            }
            routie('refresh')
          })
        })
      })
      .catch(function () {
        routie('error')
      })
    }
  }

  app.init()

})()