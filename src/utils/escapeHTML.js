// https://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript/39243641#39243641
const escapeChars = {
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  '&': 'amp',
  '\'': '#39'
}

let regexString = '['
for (let key in escapeChars) {
  regexString += key
}
regexString += ']'

const escapeRegex = new RegExp(regexString, 'g')

export default function escapeHTML (str) {
  return str.replace(escapeRegex, function (m) {
    return '&' + escapeChars[m] + ';'
  })
}
