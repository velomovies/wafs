import config from './config.js'

const sections = { 
  // Toggles the right section and adds active states
  toggle: function (route) {
    let activeElements = document.querySelectorAll('.active'),
          activeLinkElements = document.querySelectorAll('nav [href="' + route + '"]'),
          sectionElements = document.querySelector(route)
    // Turns active links off and adds the right active state
    this.hideSection(activeElements)
    this.showSection(activeLinkElements, sectionElements) 
  },
  hideSection: function (elements) {
    elements.forEach(function (element) {
      element.classList.remove('active')
      if (element.nodeName === 'SECTION' && config.refresh) {
        window.setTimeout(function () {
            element.classList.add('hidden')
        }, 300);
      }
      config.refresh = true
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

export default sections

