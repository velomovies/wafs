(function () {
  "use strict"

  var app = {
    init: function () {
      router.init()
    }
  }

  var router = {
    init: function () { 
      routie({
        'home': function () {
          sections.toggle('#home')
          api.getData('/pages' + api.language + '/rijksstudio/kunstenaars/' + api.artistInfo + '?').then(function (data) {
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
        '': function () {
          sections.toggle('#home')
        },
        '*': function () {
          sections.toggle('#error')
        }
      })
    }
  }

  var api = {
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

    getData: function (dataEndpoint) {
      var loadData = new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', api.url + dataEndpoint + 'key=' + config.key + '&format=' + api.format, true)
    
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
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
      
      return loadData;
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
    }
  }

  var template = {
    render: function (data, route, template) {
      Transparency.render(helper.qs(route), template(data), this.directivesMethod())
    },
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

  app.init()

})()