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
 * @param {number} payload
 * @param {Array} screens
 * @returns {Promise<Object>}
 * @description Update project screens.
 */
async function updateProject (payload, screens) {
  const projectDataInstance = await renderforest.getProjectData(payload)

  const _screens = projectDataInstance.getScreens()

  screens.forEach((screen) => {
    screen.areas.forEach((area, index) => {
      area.title = area.title.length === 0 ? 'title' : area.title
      area.order = index
    })

    const screenToPush = {
      id: screen.id,
      duration: screen.duration,
      extraVideoSecond: 0,
      gifPath: screen.gifPath,
      gifBigPath: screen.gifBigPath,
      gifThumbnailPath: screen.gifThumbnailPath,
      hidden: false,
      path: screen.path,
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
  const projectId = projectDataInstance.getProjectId()
  const data = projectDataInstance.getPatchObject()

  const result = await renderforest.updateProjectDataPartial({ projectId, data })

  projectDataInstance.resetPatchObject()

  return result
}

module.exports = {
  createProject,
  updateProject
}