const request = require('request-promise')

function getAllPluggableScreens () {
  return request('https://www.renderforest.com/api/v1/templates/701/pluggable-screens')
    .then((pluggableScreensData) => {
      const _pluggableScreens = JSON.parse(pluggableScreensData).data
      const screens = []

      _pluggableScreens.forEach((pluggableScreen) => {
        pluggableScreen.screens.forEach((screen) => {
          screens.push(screen)
        })
      })
      return screens
    })
}

module.exports = {
  getAllPluggableScreens
}
