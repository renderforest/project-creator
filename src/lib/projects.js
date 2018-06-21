const Renderforest = require('@renderforest/sdk-node')

const renderforest = new Renderforest({
  signKey: process.env.SIGN_KEY,
  clientId: process.env.CLIENT_ID
})

/**
 * @returns {Promise<Object>}
 * @description Create project with 701 template.
 */
function createProject () {
  const payload = {
    templateId: 701
  }
  return renderforest.addProject(payload)
}

/**
 * @param {Object} payload
 * @param {number} payload.projectId
 * @param {Array} payload.projectScreens
 * @param {Array} payload.pluggableScreens
 * @returns {Promise<Object>}
 * @description Update project screens.
 */
async function updateProject (payload) {
  const {projectId, projectScreens, pluggableScreens} = payload

  const projectDataInstance = await renderforest.getProjectData({projectId})

  const _screens = projectDataInstance.getScreens()

  projectScreens.forEach((screen) => {

    const pluggableScreen = pluggableScreens.find((pluggableScreen) => {
      return pluggableScreen.compositionName === screen.compositionName
    })

    screen.areas.forEach((area) => {
      const _pluggableScreenArea = pluggableScreen.areas.find((pluggableScreenArea) => {
        return pluggableScreenArea.type === 'text'
      })

      area.id = _pluggableScreenArea.id
      area.height = _pluggableScreenArea.height
      area.width = _pluggableScreenArea.width
      area.cords = _pluggableScreenArea.cords
      area.wordCount = area.wordCount || _pluggableScreenArea.wordCount
      area.title = area.title.length === 0 ? _pluggableScreenArea.title : area.title
      area.order = area.order || _pluggableScreenArea.order
      area.type = 'text'

    })

    const screenToPush = {
      id: pluggableScreen.id,
      duration: pluggableScreen.duration,
      extraVideoSecond: 0,
      gifPath: pluggableScreen.gifPath,
      gifBigPath: pluggableScreen.gifBigPath,
      gifThumbnailPath: pluggableScreen.gifThumbnailPath,
      hidden: false,
      path: pluggableScreen.path,
      compositionName: screen.compositionName,
      order: screen.order,
      tags: screen.tags,
      title: screen.title,
      areas: screen.areas
    }

    _screens.push(screenToPush)
  })

  projectDataInstance.setScreens(_screens)

  // get payload data
  const updatePayload = {
    projectId: projectDataInstance.getProjectId(),
    data: projectDataInstance.getPatchObject()
  }

  const result = await renderforest.updateProjectDataPartial(updatePayload)

  projectDataInstance.resetPatchObject()

  return result
}

module.exports = {
  createProject,
  updateProject
}