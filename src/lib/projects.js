const Renderforest = require('@renderforest/sdk-node')

const renderforest = new Renderforest({
  signKey: process.env.RF_SIGN_KEY,
  clientId: process.env.RF_CLIENT_ID
})

const StringsUtil = require('../util/strings')

/**
 * @private
 * @param {Object} area
 * @param {Object} _pluggableScreenArea
 * @description Set missing fields on area from pluggable screen area.
 */
function _setMissingFieldsOnArea (area, _pluggableScreenArea) {
  area.id = _pluggableScreenArea.id
  area.height = _pluggableScreenArea.height
  area.width = _pluggableScreenArea.width
  area.cords = _pluggableScreenArea.cords
  area.wordCount = StringsUtil.countWords(area.value)
  area.title = _pluggableScreenArea.title
  area.order = _pluggableScreenArea.order
  area.type = 'text'
}

/**
 * @private
 * @param {Object} screen
 * @param {Object} pluggableScreen
 * @returns {Object}
 * @description Get normalized screen for project update.
 */
function _getNormalizedScreenForUpdate (screen, pluggableScreen) {
  return {
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
}

/**
 * @private
 * @param {Object} pluggableScreen
 * @returns {Promise<Array>}
 * @description Get text areas of pluggable screen ordered by area.order.
 */
function _getPluggableScreenTextAreas(pluggableScreen){
  return pluggableScreen.areas
    .filter((pluggableScreenArea) => pluggableScreenArea.type === 'text')
    .sort((area1, area2) => area1.order - area2.order)
}

/**
 * @private
 * @returns {Promise<Object>}
 * @description Create project with 701 template.
 */
function _createEmptyProject () {
  return renderforest.addProject({templateId: 701})
}

/**
 * @private
 * @param {Object} payload
 * @param {number} payload.projectId
 * @param {Array} payload.projectScreens
 * @param {Array} payload.pluggableScreens
 * @returns {Promise<Object>}
 * @description Update project screens.
 */
async function _updateProject (payload) {
  const {projectId, projectScreens, pluggableScreens} = payload

  const projectDataInstance = await renderforest.getProjectData({projectId})

  const _screens = projectDataInstance.getScreens()

  projectScreens.forEach((screen) => {

    const pluggableScreen = pluggableScreens.find((pluggableScreen) => {
      return pluggableScreen.compositionName === screen.compositionName
    })

    const pluggableScreenTextAreas = _getPluggableScreenTextAreas(pluggableScreen)

    screen.areas.forEach((area, index) => {
      const _pluggableScreenArea = pluggableScreenTextAreas[index]
      _setMissingFieldsOnArea(area, _pluggableScreenArea)
    })

    _screens.push(_getNormalizedScreenForUpdate(screen, pluggableScreen))
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

/**
 * @param {Array} payload.projectScreens
 * @param {Array} payload.pluggableScreens
 * @returns {Promise<Object>}
 * @description Create project.
 */
function createProject (payload) {
  const {projectScreens, pluggableScreens} = payload

  return _createEmptyProject()
    .then((responseData) => {
      return _updateProject({
        projectId: responseData.projectId,
        projectScreens,
        pluggableScreens
      })
    })
}

module.exports = {
  createProject
}