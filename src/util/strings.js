/**
 * @param {string} str
 * @returns {number}
 * @description Count words in the string.
 */
function countWords(str) {
  return str.split(/\s+/).length
}

module.exports = {
  countWords
}