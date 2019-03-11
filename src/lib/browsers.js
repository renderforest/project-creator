const childProcess = require('child_process')
const os = require('os')

const Promise = require('bluebird')

const exec = Promise.promisify(childProcess.exec)

/**
 * Open Google Chrome on Mac.
 * @param {string} url
 */
const _openGoogleChromeOnMac = (url) => exec(`open -a "Google Chrome" ${url}`)

/**
 * Open Google Chrome on Linux.
 * @param {string} url
 */
const _openGoogleChromeOnLinux = (url) => exec(`google-chrome ${url}`)

/**
 * Open Google Chrome and navigate to the URL.
 * @param {string} url
 */
const openGoogleChrome = (url) => {
  const osPlatform = os.platform()

  if (osPlatform.indexOf('linux') !== -1) {
    return _openGoogleChromeOnLinux(url)
  } else if (osPlatform.indexOf('darwin') !== -1) {
    return _openGoogleChromeOnMac(url)
  } else {
    console.log('Could not open Google Chrome on your OS.')
    console.log(`\nClick on this URL to view the project: ${url}`)
  }
}

module.exports = {
  openGoogleChrome
}
