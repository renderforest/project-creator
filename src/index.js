const childProcess = require('child_process')
const fs = require('fs')

const Promise = require('bluebird')
const readFile = Promise.promisify(fs.readFile)
const exec = Promise.promisify(childProcess.exec)

const projectManager = require('./project-manager')

function createProject() {
  let screens

  return readFile(process.env.FILE_PATH)
    .then((data) => screens = JSON.parse(data))
    .then(projectManager.createProject)
    .then((responseData) => projectManager.updateProject(responseData, screens))
}

createProject()
  .then((data) => `https://www.renderforest.com/project/${data.projectId}`)
  .then((url) => exec(`google-chrome ${url}`))
  .catch(console.error)
