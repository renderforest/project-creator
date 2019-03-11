const { openGoogleChrome } = require('./lib/browsers')
const { buildProjectUrl, createProject } = require('./lib/projects')
const { getScreensAndPluggableScreens } = require('./lib/screens')

getScreensAndPluggableScreens()
    .then(createProject)
    .then(buildProjectUrl)
    .then(openGoogleChrome)
    .catch(console.error)
