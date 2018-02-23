const template = {
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
    const dataArt = data.artObjects
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
      id: `image/${data.artObjectPage.objectNumber}`
    }
  },
  image: function (data) {
    return {
      imageUrl: data.artObject.webImage.url
    }
  },
  selectArtist: function (data) {
    const artistNames = data.contentPage.highlights
    .map(function (item) {
      return {
        artistName: item.page.title
      }
    })
    return artistNames
  },
  // This gets all images and or links and adds the right url to it. Only when it finds it on the page
  renderDirectives: function () {
    const directives = {
      image: {
        src: function (params) {
          return this.imageUrl
        }
      },
      link: {
        href: function (params) {
          return `#detail/${this.id}`
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

export default template