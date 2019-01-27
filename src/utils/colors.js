export const rgbStringToArray = rgbString => rgbString.match(/\d+/g).map(Number)

export const rgbArrayToString = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`

export const interpolateColor = (color1, color2, factor) =>
  color1.map((color, index) => Math.round(color + factor * (color2[index] - color)))

export const interpolateColors = (color1, color2, steps) => {
  const stepFactor = 1 / (steps - 1)
  color1 = rgbStringToArray(color1)
  color2 = rgbStringToArray(color2)
  return new Array(steps)
    .fill(null)
    .map((_, step) => rgbArrayToString(interpolateColor(color1, color2, stepFactor * step)))
}
