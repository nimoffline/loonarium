// https://jsperf.com/compare-unique-array-by-property
export default function makeUnique(array, propertyName) {
  return array.filter((e, i) => array.findIndex(
    a => a[propertyName] === e[propertyName]) === i)
}
