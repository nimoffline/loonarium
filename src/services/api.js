import axios from 'axios'
import { API_URL, BASE_URL } from '../demo/constants'
import {
  setAuth,
  unsetAuth,
  getAuth
} from './localStorage'

const _axios = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export async function getUrl (url) {
  const { data } = await _axios.get(url)
  return data
}

export function recoverAuthToken () {
  const { token, username } = getAuth()
  if (token) {
    _axios.defaults.headers.common['Authorization'] = `Token ${token}`
  }
  return { token, username }
}

export async function login (username, password) {
  const { data } = await axios.post(
    `${BASE_URL}/api-token-auth/`,
    { username, password },
    { withCredentials: true }
  )
  _axios.defaults.headers.common['Authorization'] = `Token ${data.token}`
  setAuth(username, data.token)
  return { username, token: data.token }
}

export async function createUser (username, password, password2) {
  const { data } = await _axios.post('/accounts/', { username, password, password2 })
  _axios.defaults.headers.common['Authorization'] = `Token ${data.token}`
  setAuth(username, data.token)
  return data
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

export async function commentPost (dataIn) {
  const { data } = await _axios.post(`/comments/`, dataIn)
  return data
}
