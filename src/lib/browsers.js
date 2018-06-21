const childProcess = require('child_process')

const Promise = require('bluebird')

const exec = Promise.promisify(childProcess.exec)

/**
 * @param url
 * @description Open google chrome and navigate to url.
 */
function openGoogleChrome (url) {
  return exec(`google-chrome ${url}`)
}

module.exports = {
  openGoogleChrome
}