import config from './config.js'
import utils from './utils.js'

const api = {
  // Gets data from api with an url that is specified above and in the route
  getData: function (dataEndpoint) {
    utils.addLoader()
    // Uncomment if nothing has to be stored
    // localStorage.clear()
    return new Promise(function (resolve, reject) {
      // When the user has info in the localStorage it gets the data from the localStorage
      if (localStorage.getItem(dataEndpoint)) {
        const data = JSON.parse(localStorage.getItem(dataEndpoint))
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }

      } else {
        // When there is no localStorage and the user has not been at the website before it request the data from the api
        api.requestData(resolve, reject, dataEndpoint)
      }
    })
  },
  requestData: function (resolve, reject, dataEndpoint) {
    // This starts a HTTP request which gived us the right data from the right url. The url is build from a few parameters
    const request = new XMLHttpRequest()
    
    request.open('GET', `${config.url + dataEndpoint}key=${config.key}&format=${config.format}`, true)

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Gets data and resolves and rejects if error. It puts the data in localStorage so that it can be used later
        let data = JSON.parse(request.responseText)
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

export default api