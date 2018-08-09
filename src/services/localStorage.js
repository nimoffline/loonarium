import store from 'store'

const AUTH_TOKEN = 'LoonariumAuthToken'
const AUTH_USERNAME = 'LoonariumAuthUsername'
const AUTH_USERID = 'LoonariumAuthUserId'

export function setAuth (username, token, id) {
  store.set(AUTH_TOKEN, token)
  store.set(AUTH_USERNAME, username)
  store.set(AUTH_USERID, id)
}

export function unsetAuth (token) {
  store.set(AUTH_TOKEN, undefined)
  store.set(AUTH_USERNAME, undefined)
  store.set(AUTH_USERID, undefined)
}

export function getAuth () {
  const data = {
    token: store.get(AUTH_TOKEN),
    username: store.get(AUTH_USERNAME),
    id: store.get(AUTH_USERID)
  }
  return data
}
