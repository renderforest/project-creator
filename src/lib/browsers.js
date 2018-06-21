const childProcess = require('child_process')
const os = require('os')

const Promise = require('bluebird')

const exec = Promise.promisify(childProcess.exec)

/**
 * @private
 * @param {string} url
 * @description Open Google Chrome on Mac.
 */
function _openGoogleChromeOnMac(url){
  return exec(`open -a "Google Chrome" ${url}`)
}

/**
 * @private
 * @param {string} url
 * @description Open Google Chrome on Linux.
 */
function _openGoogleChromeOnLinux(url){
  return exec(`google-chrome ${url}`)
}

/**
 * @param {string} url
 * @description Open Google Chrome and navigate to the URL.
 */
function openGoogleChrome (url) {
  const osPlatform = os.platform()

  if(osPlatform.indexOf('linux') !== -1){
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