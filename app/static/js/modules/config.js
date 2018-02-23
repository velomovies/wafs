import api from './api.js'

const config = {
  // Here you find a few settings that could be usefull for the user
  key: 'rS2jUIgJ',
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
  refresh: true
}

export default config
