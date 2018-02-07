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
                    sections.toggle('#start')
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
            document.querySelectorAll('section').forEach(function (el) {
                el.classList.remove('active')
            })
            document.querySelector(route).classList.add('active')
        }
    }

    app.init()

}) ()