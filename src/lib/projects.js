const Renderforest = require('@renderforest/sdk-node')

const renderforest = new Renderforest({
  signKey: process.env.RF_SIGN_KEY,
  clientId: process.env.RF_CLIENT_ID
})

const StringsUtil = require('../util/strings')

/**
 * Set missing fields on area from pluggable screen area.
 * @param {Object} area
 * @param {Object} _pluggableScreenArea
 */
const _setMissingFieldsOnArea = (area, _pluggableScreenArea) => {
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
 * Get normalized screen for project update.
 * @param {Object} screen
 * @param {Object} pluggableScreen
 * @returns {Object}
 */
const _getNormalizedScreenForUpdate = (screen, pluggableScreen) => {
  const { compositionName, duration: screenDuration, order, tags, title, areas } = screen
  const {
    id,
    characterBasedDuration,
    duration: pluggableDuration,
    gifPath,
    gifBigPath,
    gifThumbnailPath,
    maxDuration,
    path
  } = pluggableScreen

  return {
    id,
    characterBasedDuration,
    compositionName,
    duration: screenDuration || pluggableDuration,
    extraVideoSecond: 0,
    gifPath,
    gifBigPath,
    gifThumbnailPath,
    hidden: false,
    maxDuration,
    order,
    path,
    tags,
    title,
    areas
  }
}


/**
 * Find pluggable screen with compositionName.
 * @param {Array} pluggableScreens
 * @param {string} compositionName
 * @returns {Object}
 */
const _findPluggableScreen = (pluggableScreens, compositionName) =>
    pluggableScreens.find((pluggableScreen) => pluggableScreen.compositionName === compositionName)

/**
 * Get text areas of pluggable screen ordered by area.order.
 * @param {Object} pluggableScreen
 * @returns {Array}
 */
const _getPluggableScreenTextAreas = (pluggableScreen) => pluggableScreen.areas
    .filter((pluggableScreenArea) => pluggableScreenArea.type === 'text')
    .sort((area1, area2) => area1.order - area2.order)

/**
 * Create project with 701 template.
 * @returns {Promise<Object>}
 */
const _createEmptyProject = () => renderforest.addProject({ templateId: 701 })

/**
 * Update project screens.
 * @param {number} projectId
 * @param {Array} projectScreens
 * @param {Array} pluggableScreens
 * @returns {Promise<Object>}
 */
const _updateProject = async({ projectId, projectScreens, pluggableScreens }) => {
  const projectDataInstance = await renderforest.getProjectData({ projectId })

  const _screens = projectDataInstance.getScreens()

  projectScreens.forEach((screen) => {
    const pluggableScreen = _findPluggableScreen(pluggableScreens, screen.compositionName)
    const pluggableScreenTextAreas = _getPluggableScreenTextAreas(pluggableScreen)

    screen.areas.forEach((area, index) => {
      _setMissingFieldsOnArea(area, pluggableScreenTextAreas[index])
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
 * Builds project url with given `projectId`.
 * @param {number} projectId - The project id to create url.
 * @return {string} - The project url.
 */
const buildProjectUrl = ({ projectId }) => {
  const url = `https://www.renderforest.com/project/${projectId}`
  console.log(`\nFollow this URL to view the project: ${url}`)

  return url
}

/**
 * Create project.
 * @param {Array} projectScreens
 * @param {Array} pluggableScreens
 * @returns {Promise<Object>}
 */
const createProject = ({ projectScreens, pluggableScreens }) => _createEmptyProject()
    .then((responseData) => _updateProject({
      projectId: responseData.projectId,
      projectScreens,
      pluggableScreens
    }))

module.exports = {
  buildProjectUrl,
  createProject
}
