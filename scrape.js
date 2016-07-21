import _ from 'lodash'
import LegistarClient from './lib/legistar'

const legistar = new LegistarClient('Seattle')

async function main () {
  try {
    const matters = await legistar.getAllMatters() // automatically pages the API, returning more than 1000 records

    for (const matter of matters) {
      const m = await legistar.getFullMatter(matter)
      console.log(m)
    }
  } catch (err) {
    console.error(err)
  }
}
main()

