const proxyquire = require('proxyquire')

require('babel-node-modules')([
  'cerebro-ui'
])

const uniq = require('lodash/uniq')
const { assert } = require('chai')

const appsList = [
  {
    name: 'App Store',
    filename: 'App Store.app',
    path: '/Applications/App Store.app'
  },
  {
    name: 'App Store',
    filename: 'App Store.prefPane',
    path: '/System/Library/PreferencePanes/AppStore.prefPane'
  },
  {
    name: 'League of Legends',
    filename: 'League of Legends.app',
    path: '/Applications/League of Legends.app'
  },
  {
    name: 'AudioBookBinder',
    filename: 'AudioBookBinder.app',
    path: '/Applications/AudioBookBinder.app'
  }
]

const apps = proxyquire('../src/index', {
  react: () => {},
  './lib/getAppsList': () => Promise.resolve(appsList),
  './Preview': () => {},
})

describe('OSx apps plugin', () => {
  it('shows two apps with the same name but different paths', (done) => {
    const term = 'App'
    const display = (results) => {
      const ids = results.map(file => file.id || file.title)
      assert(uniq(ids).length === 2)
      done()
    }
    apps.fn({ term, display })
  })

  it('result includes clipboard key with full path', (done) => {
    const term = 'App'
    const display = (results) => {
      assert(results[0].clipboard === appsList[0].path)
      done()
    }
    apps.fn({ term, display })
  })

  it('search for app by abbreviation with spaces', (done) => {
    const term = 'lol'
    const display = (results) => {
      assert(results[0].title === 'League of Legends')
      done()
    }
    apps.fn({ term, display })
  })

  it('search for app by abbreviation with CamelCase', (done) => {
    const term = 'abb'
    const display = (results) => {
      assert(results[0].title === 'AudioBookBinder')
      done()
    }
    apps.fn({ term, display })
  })
})
