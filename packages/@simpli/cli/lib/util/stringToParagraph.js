const chunk = require('lodash.chunk')

module.exports = function stringToParagraph (str = '', wordsPerLine = 10, afterBreak = '') {
  if (!str) {
    return null
  }

  const words = str.split(' ')

  const linesWithWords = chunk(words, wordsPerLine) || []
  const lines = linesWithWords.map((words) => `${words.join(' ')}\n${afterBreak}`)

  return lines.join('').slice(0, -(afterBreak.length + 1))
}
