const fs = require('fs')

const Promise = require('bluebird')
const request = require('request-promise')

const readFile = Promise.promisify(fs.readFile)

/**
 * @private
 * @returns {Promise<Array>}
 * @description Get all pluggable screens.
 */
function _getAllPluggableScreens () {
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

/**
 * @private
 * @param {string} filePath
 * @returns {Promise<Array>}
 * @description Get screens from JSON file.
 */
function _getScreensFromFile (filePath) {
  return readFile(filePath).then((data) => JSON.parse(data))
}

/**
 * @returns {Promise<Object>}
 * @description Get screens and pluggable screens.
 */
function getScreensAndPluggableScreens () {
  let projectScreens

  return _getScreensFromFile(process.env.JSON_FILE_PATH)
    .then((_projectScreens) => projectScreens = _projectScreens)
    .then(_getAllPluggableScreens)
    .then((pluggableScreens) => ({pluggableScreens, projectScreens}))
}

module.exports = {
  getScreensAndPluggableScreens
}
