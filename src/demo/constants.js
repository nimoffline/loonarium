const demoVideoOptions = [
  { title: 'Only Silk (Shingo Nakamura)', code: 'k0MPgKG8oh4', comment_count: 2, id: 1 },
  { title: 'Sonatine (LOONA 1/3)', code: 'a6JmCdDs_GM', comment_count: 4, id: 2 },
  { title: 'love (DEAN)', code: 'SkNB5AsgZOc', comment_count: 4, id: 3 },
  { title: 'ViViD (Heejin)', code: '-FCYE87P5L0', comment_count: 0, id: 4 }
]

const demoCmts = [
  {
    author: 1,
    author_username: 'orbit',
    time: 58.2342,
    id: 1,
    text: '현진 is seen repeatedly in front of a ferris wheel',
    video_code: 'a6JmCdDs_GM'
  },
  {
    author: 2,
    author_username: 'Ana Lysis',
    time: 62.0121,
    id: 2,
    text: 'Choreo here is just a visualization of the lyrics',
    video_code: 'a6JmCdDs_GM'
  },
  {
    author: 3,
    author_username: 'halfEmpty',
    time: 63,
    id: 3,
    text: 'Vertical line of symmetry with buildings and choreo',
    video_code: 'a6JmCdDs_GM'
  },
  {
    author: 4,
    author_username: 'btw',
    time: 59,
    id: 4,
    text: '#streamsonatine nvm we\'re at 1m now :)',
    video_code: 'a6JmCdDs_GM'
  },
  {
    author: 5,
    author_username: 'author 68',
    time: 1,
    id: 5,
    text: 'this is the first of two comments on this song',
    video_code: 'k0MPgKG8oh4'
  },
  {
    author: 5,
    author_username: 'author 68',
    time: 5,
    id: 6,
    text: 'this is the second of two comments on this song',
    video_code: 'k0MPgKG8oh4'
  },
  {
    author: 6,
    author_username: 'whatAreThooooose',
    time: 207,
    id: 7,
    text: 'anyone know where I can get that coat?',
    video_code: 'SkNB5AsgZOc'
  },
  {
    author: 7,
    author_username: 'anon1988',
    time: 210,
    id: 8,
    text: 'love that break',
    video_code: 'SkNB5AsgZOc'
  },
  {
    author: 8,
    author_username: 'myguy',
    time: 211,
    id: 9,
    text: 'ok this is genius',
    video_code: 'SkNB5AsgZOc'
  },
  {
    author: 9,
    author_username: 'purple',
    time: 212,
    id: 10,
    text: 'CHORDS',
    video_code: 'SkNB5AsgZOc'
  },
]

export const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000/api'
export const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'
