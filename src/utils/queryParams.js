import queryString from 'query-string'

export const getQueryParams = () => {
  return queryString.parse(window.location.search)
};

export const setQueryParams = paramDict => {
  const queryParams = queryString.parse(window.location.search)
  Object.keys(paramDict).forEach(key => {
    queryParams[key] = paramDict[key]
  })
  window.history.replaceState(null, '', `?${queryString.stringify(queryParams)}`)
}