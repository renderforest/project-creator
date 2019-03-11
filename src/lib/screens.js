const fs = require('fs')

const Promise = require('bluebird')
const request = require('request-promise')

const readFile = Promise.promisify(fs.readFile)

const defaultFilePath = `${__dirname}/../../example-file.json`

/**
 * Get all pluggable screens.
 * @returns {Promise<Array>}
 */
const _getAllPluggableScreens = () => request('https://www.renderforest.com/api/v1/templates/701/pluggable-screens')
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

/**
 * Get screens from JSON file.
 * @param {string} filePath
 */
const _getScreensFromFile = (filePath) => readFile(filePath)
    .then(JSON.parse)

/**
 * Get screens and pluggable screens.
 * @returns {Promise<Object>}
 */
const getScreensAndPluggableScreens = () =>
    Promise.all([_getScreensFromFile(process.env.JSON_FILE_PATH || defaultFilePath), _getAllPluggableScreens()])
        .then(([projectScreens, pluggableScreens]) => ({ pluggableScreens, projectScreens }))

module.exports = {
  getScreensAndPluggableScreens
}
