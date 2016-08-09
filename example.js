import _ from 'lodash'
import LegistarClient from './src'
import compose from 'koa-compose'
import { useFilesystemCache } from './src/middleware/cache'
import { throttle } from './src/middleware/throttle'
import { promisifiedRequest } from './src/middleware/request'

const request = compose([
  useFilesystemCache({ directory: '.cache' }),
  throttle(250),
  promisifiedRequest
])

const legistar = new LegistarClient('Seattle', request)

async function main () {
  try {
    const matters = await legistar.getAllMatters() // automatically pages the API, returning more than 1000 records
    console.log('matters.length =', matters.length)

    for (const matter of matters.slice(0, 5)) {
      const m = await legistar.getFullMatter(matter)
      console.log(m.MatterId, m.MatterFile)
    }
  } catch (err) {
    console.error(err)
  }
}
main()

