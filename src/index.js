const childProcess = require('child_process')
const fs = require('fs')

const Promise = require('bluebird')
const readFile = Promise.promisify(fs.readFile)
const exec = Promise.promisify(childProcess.exec)

const projectManager = require('./project-manager')
const pluggableScreensManager = require('./pluggable-screens-manager')


/**
 * @param {Array} payload.projectScreens
 * @param {Array} payload.pluggableScreens
 * @returns {Promise<Object>}
 * @description Create project.
 */
function createProject(payload) {
  const { projectScreens, pluggableScreens } = payload

  return projectManager.createProject()
    .then((responseData) => {
      return projectManager.updateProject({
        projectId: responseData.projectId,
        projectScreens,
        pluggableScreens
      })
    })
}

function getScreensAndPluggableScreens() {
  let projectScreens

  return readFile(process.env.FILE_PATH)
    .then((data) => projectScreens = JSON.parse(data))
    .then(() => pluggableScreensManager.getAllPluggableScreens())
    .then((pluggableScreens) => ({ pluggableScreens, projectScreens }))
}

getScreensAndPluggableScreens()
  .then(createProject)
  .then((data) => `https://www.renderforest.com/project/${data.projectId}`)
  .then((url) => exec(`google-chrome ${url}`))
  .catch(console.error)
