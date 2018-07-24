export const demoVideoOptions = [
  {title: 'Only Silk (Shingo Nakamura)', code: 'k0MPgKG8oh4'},
  {title: 'Sonatine (LOONA 1/3)', code: 'a6JmCdDs_GM'},
  {title: 'love (DEAN)', code: 'SkNB5AsgZOc'},
  {title: 'ViViD (Heejin)', code: '-FCYE87P5L0'}
];

let demoCmts = [
  {
    author: 'orbit',
    timeStart: 58,
    id: 1,
    text: '현진 is seen repeatedly in front of a ferris wheel',
    videoCode: 'a6JmCdDs_GM'
  },
  {
    author: 'Ana Lysis',
    timeStart: 62,
    id: 2,
    text: 'Choreo here is just a visualization of the lyrics',
    videoCode: 'a6JmCdDs_GM'
  },
  {
    author: 'halfEmpty',
    timeStart: 63,
    id: 3,
    text: 'Vertical line of symmetry with buildings and choreo',
    videoCode: 'a6JmCdDs_GM'
  },
  {
    author: 'btw',
    timeStart: 59,
    id: 4,
    text: '#streamsonatine nvm we\'re at 1m now :)',
    videoCode: 'a6JmCdDs_GM'
  },
  {
    author: 'author 68',
    timeStart: 1,
    id: 5,
    text: 'this is the first of two comments on this song',
    videoCode: 'k0MPgKG8oh4'
  },
  {
    author: 'author 68',
    timeStart: 5,
    id: 6,
    text: 'this is the second of two comments on this song',
    videoCode: 'k0MPgKG8oh4'
  },
  {
    author: 'whatAreThooooose',
    timeStart: 207,
    id: 7,
    text: 'anyone know where I can get that coat?',
    videoCode: 'SkNB5AsgZOc'
  },
  {
    author: 'anon1988',
    timeStart: 210,
    id: 8,
    text: 'love that break',
    videoCode: 'SkNB5AsgZOc'
  },
  {
    author: 'myguy',
    timeStart: 211,
    id: 9,
    text: 'ok this is genius',
    videoCode: 'SkNB5AsgZOc'
  },
  {
    author: 'purple',
    timeStart: 212,
    id: 10,
    text: 'CHORDS',
    videoCode: 'SkNB5AsgZOc'
  },
];
demoCmts = demoCmts.sort((c1, c2) => c1.timeStart > c2.timeStart)

export const demoComments = demoCmts
