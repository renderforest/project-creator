const BrowsersLib = require('./lib/browsers')
const ProjectsLib = require('./lib/projects')
const ScreensLib = require('./lib/screens')

ScreensLib.getScreensAndPluggableScreens()
  .then(ProjectsLib.createProject)
  .then((responseData) => {
    const url = `https://www.renderforest.com/project/${responseData.projectId}`
    console.log(`\nFollow this URL to view the project: ${url}`)

    return url
  })
  .then(BrowsersLib.openGoogleChrome)
  .catch(console.error)
