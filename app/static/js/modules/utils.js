import config from './config.js'
import api from './api.js'
import template from './template.js'

const utils = {
  // This is a function on one page. It gives an effect when you scroll on the page
  onScroll: function () {
    let lastScrollTop = 0
    let smallImages = document.querySelectorAll('.smallImage')

    window.addEventListener("scroll", function () {
      let st = window.pageYOffset || document.documentElement.scrollTop

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
  // This makes sure the button to select an artist works
  showSettings: function () {
    this.selectArtist()
    document.querySelector('aside svg').addEventListener('click', function () {
      document.querySelector('aside article').classList.toggle('active')
    })
  },
  selectArtist: function () {
    api.getData(`/pages${config.language}/rijksstudio/kunstenaars/?`)
    .then(function (data) {
      // Renders the right data with a few parameters to show the right content
      template.render(data, '#selectArtist', template.selectArtist)
    })
    .then(function () {
      document.querySelectorAll('.selectArtist li').forEach(function (element) {
        element.addEventListener('click', function () {
          let artist = this.innerText,
              namePlus = artist.replace(/ /g, '+'),
              nameLow = artist.toLowerCase(),
              nameMinus = nameLow.replace(/ /g, '-'),
              nameArtistInfo = nameMinus.split('.').join('')
          localStorage.setItem('artistCollection', namePlus)
          localStorage.setItem('artistInfo', nameArtistInfo)
          if(location.hash == '#home') {
            config.refresh = false
          }
          routie('refresh')
        })
      })
    })
    .catch(function () {
      routie('error')
    })
  },
  // A quick way to show and hide the loader
  deleteLoader: function () {
    document.querySelector('.loader').classList.add('hidden')
  },
  addLoader: function () {
    document.querySelector('.loader').classList.remove('hidden')
  }
}

export default utils