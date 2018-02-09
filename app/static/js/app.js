(function () {
    "use strict"

    var app = {
        init: function () {
            this.handleEvents()
            routes.init()
        },
        handleEvents: function () {
            window.addEventListener('load', function (event) {
                var hash = location.hash
                if (hash) {
                    routes.pushState(hash)
                } else {
                  //zet de beginwaarde niet hadnmatig maar zoek je eerste sections
                  var toggleElement = '#' + document.querySelectorAll('section')[0].id
                    sections.toggle(toggleElement)
                }
            })
        }
    }

    var routes = {
        init: function () {
            this.handleEvents()
        },
        handleEvents: function () {
            var self = this
            window.addEventListener('hashchange', function (event) {
                var hash = location.hash
                self.pushState(hash)
            })
        },
        pushState: function (route) {
            sections.toggle(route)
        }
    }

    var sections = {
        toggle: function (route) {
            this.turnOff(document.querySelectorAll('section'))
            document.querySelector(route).classList.add('active')
        },
        //een turnoff methode om meer overzicht te krijgen, deze methode kan je later ook weer hergebruiken.
        turnOff: function(elements){
          elements.forEach(function (el) {
              el.classList.remove('active')
          })
        }
    }

    app.init()

}) ()
