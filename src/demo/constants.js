export const demoVideoOptions = [
  {title: 'Only Silk (Shingo Nakamura)', code: 'k0MPgKG8oh4'},
  {title: 'Sonatine (LOONA 1/3)', code: 'a6JmCdDs_GM'},
  {title: 'love (DEAN)', code: 'SkNB5AsgZOc'},
  {title: 'ViViD (Heejin)', code: '-FCYE87P5L0'}
]

let demoCmts = [
  {
    author: 'orbit',
    time: 58,
    id: 1,
    text: '현진 is seen repeatedly in front of a ferris wheel',
    video_code: 'a6JmCdDs_GM'
  },
  {
    author: 'Ana Lysis',
    time: 62,
    id: 2,
    text: 'Choreo here is just a visualization of the lyrics',
    video_code: 'a6JmCdDs_GM'
  },
  {
    author: 'halfEmpty',
    time: 63,
    id: 3,
    text: 'Vertical line of symmetry with buildings and choreo',
    video_code: 'a6JmCdDs_GM'
  },
  {
    author: 'btw',
    time: 59,
    id: 4,
    text: '#streamsonatine nvm we\'re at 1m now :)',
    video_code: 'a6JmCdDs_GM'
  },
  {
    author: 'author 68',
    time: 1,
    id: 5,
    text: 'this is the first of two comments on this song',
    video_code: 'k0MPgKG8oh4'
  },
  {
    author: 'author 68',
    time: 5,
    id: 6,
    text: 'this is the second of two comments on this song',
    video_code: 'k0MPgKG8oh4'
  },
  {
    author: 'whatAreThooooose',
    time: 207,
    id: 7,
    text: 'anyone know where I can get that coat?',
    video_code: 'SkNB5AsgZOc'
  },
  {
    author: 'anon1988',
    time: 210,
    id: 8,
    text: 'love that break',
    video_code: 'SkNB5AsgZOc'
  },
  {
    author: 'myguy',
    time: 211,
    id: 9,
    text: 'ok this is genius',
    video_code: 'SkNB5AsgZOc'
  },
  {
    author: 'purple',
    time: 212,
    id: 10,
    text: 'CHORDS',
    video_code: 'SkNB5AsgZOc'
  },
]
demoCmts = demoCmts.sort((c1, c2) => c1.time > c2.time)

export const demoComments = demoCmts

export const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000/api'
export const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'
