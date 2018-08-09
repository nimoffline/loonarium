import store from 'store'

const AUTH_TOKEN = 'LoonariumAuthToken'
const AUTH_USERNAME = 'LoonariumAuthUsername'

export function setAuth (username, token) {
  store.set(AUTH_TOKEN, token)
  store.set(AUTH_USERNAME, username)
}

export function unsetAuth (token) {
  store.set(AUTH_TOKEN, null)
  store.set(AUTH_USERNAME, null)
}

export function getAuth () {
  const data = {
    token: store.get(AUTH_TOKEN),
    username: store.get(AUTH_USERNAME)
  }
  return data
}
