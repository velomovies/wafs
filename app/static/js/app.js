(function () {
    "use strict"

    var app = {
        init: function () {
            var hash = location.hash
            if (hash) {
                sections.toggle(hash)
            } else {
                sections.toggle('#start')
            }

            routes.init()
        }
    }

    var routes = {
        init: function () {
            this.handleEvents()
        }, 
        handleEvents: function () {
            window.addEventListener('hashchange', function (event) {
                var hash = location.hash
                sections.toggle(hash)
            })
        }
    }

    var sections = {
        toggle: function (route) {
            var sections = document.querySelectorAll('section')

            sections.forEach(function (el) {
                el.classList.remove('active')
            })

            document.querySelector(route).classList.add('active')
        }
    }

    app.init()

}) ()