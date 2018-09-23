import axios from 'axios'
import { API_URL, BASE_URL } from '../demo/constants'
import Vue from 'vue'
import {
  setAuth,
  unsetAuth,
  getAuth
} from './localStorage'

const _axios = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

_axios.interceptors.response.use(response => response, 
  error => {
    if (error.response) {
      if (error.response.status === 429) {
        if (Vue) {
          Vue.notify({
            group: 'base',
            title: 'User rate limit reached - try again in an hour',
            type: 'error'
          })
        } else alert('User rate limit reached - try again in an hour')
      } else if (!error.response.status) {
        if (Vue) {
          Vue.notify({
            group: 'base',
            title: 'Could not connect to server',
            type: 'error'
          })
        } else alert('Could not connect to server')
      }
    }
    throw error
  }
)


export async function getUrl (url) {
  const { data } = await _axios.get(url)
  return data
}

export function recoverAuthToken () {
  const { token, username, id } = getAuth()
  if (token) {
    _axios.defaults.headers.common['Authorization'] = `Token ${token}`
  }
  return { token, username, id }
}

export async function login (username, password) {
  const { data } = await axios.post(
    `${BASE_URL}/api-token-auth/`,
    { username, password },
    { withCredentials: true }
  )
  _axios.defaults.headers.common['Authorization'] = `Token ${data.token}`
  setAuth(username, data.token, data.id)
  return { username, token: data.token, id: data.id }
}

export async function createUser (username, password, password2) {
  try {
    const { data } = await _axios.post('/accounts/', { username, password, password2 })
    _axios.defaults.headers.common['Authorization'] = `Token ${data.token}`
    setAuth(username, data.token, data.id)
    return data
  } catch (e) {
    console.error(e)
    throw e
  }
}

export function logout () {
  _axios.defaults.headers.common['Authorization'] = null
  unsetAuth()
}

export async function fetchVideoCommentsByPage (videoCode, page=1) {
  const { data } = await _axios.get(`/comments/video/?video=${videoCode}&page=${page}`)
  return data
}

export async function fetchVideos () {
  const { data } = await _axios.get('/videos/')
  return data
}

export async function commentDelete (commentId) {
  const { data } = await _axios.delete(`/comments/${commentId}/`)
  return data
}

export async function commentEdit (dataIn) {
  const { data } = await _axios.patch(`/comments/${dataIn.id}/`, dataIn)
  return data
}

export async function commentPost (dataIn) {
  const { data } = await _axios.post(`/comments/`, dataIn)
  return data
}
