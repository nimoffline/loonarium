const htmlEntities = {
  nbsp: ' ',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '&',
  apos: '\''
}

export default function unescapeHTML (str) {
  if (!str) return ''
  return str.replace(/&([^;]+);/g, function (entity, entityCode) {
    let match

    if (entityCode in htmlEntities) {
      return htmlEntities[entityCode]
      /* eslint no-cond-assign: 0 */
    } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
      return String.fromCharCode(parseInt(match[1], 16))
      /* eslint no-cond-assign: 0 */
    } else if (match = entityCode.match(/^#(\d+)$/)) {
      return String.fromCharCode(~~match[1])
    } else {
      return entity
    }
  })
}
