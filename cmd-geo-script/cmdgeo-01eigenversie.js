// Object literal notation

'use strict'

(function () {
  var app = {
        init: function () {
            position.set()
        }
    }

    var position = {
        set: function () {},
        check: function () {
            var el = document.body
            var self = this
            this.set()

            el.addEventListener('touchstart', function () {
                self.update()
            })
        },
        update: function () {},
        set: function () {}
    }

    var gMap = {
        generate: function () {},
        update: function () {}
    }

    var helper = {
        isNumber: function () {},
        getElement: function () {
            return document.querySelector(element)
        },
        getElements: function () {
            return document.querySelectorAll(elements)
        }
    }

    var $ = helper.getElement()

    //start the application
    app.init()
})()
