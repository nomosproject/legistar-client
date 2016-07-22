import compose from 'koa-compose'
import { useFilesystemCache } from './middleware/cache'
import { promisifiedRequest } from './middleware/request'
import { throttle } from './middleware/throttle'

const request = compose([
  useFilesystemCache({ directory: '.cache' }),
  throttle(250),
  promisifiedRequest
])

const RESULTS_PER_PAGE = 1000
async function fetchFromLegistar (url, acc = [], currentPage = 0) {
  const skip = RESULTS_PER_PAGE * currentPage
  const { response } = await request({ url: `${url}?$skip=${skip}` })
  const items = JSON.parse(response)
  acc = acc.concat(items)

  if (items.length === RESULTS_PER_PAGE) {
    acc = fetchFromLegistar(url, acc, currentPage + 1)
  }

  return acc
}

export default class LegistarClient {
  constructor (client) {
    this.client = client
    this.URL_BASE = `http://webapi.legistar.com/v1/${client}`
  }

  async getAllMatters () {
    return await fetchFromLegistar(`${this.URL_BASE}/matters`)
  }

  async getMatterHistory (matter) {
    return await fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/histories`)
  }

  async getMatterTexts (matter) {
    const versions = await fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/versions`)
    let texts = []
    for (const version of versions) {
      const text = await fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/texts/${version.Key}`)
      texts = texts.concat(text)
    }
    return texts
  }

  async getMatterSponsors (matter) {
    return await fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/sponsors`)
  }

  async getMatterAttachments (matter) {
    return await fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/attachments`)
  }

  async getMatterCodeSections (matter) {
    return await fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/codesections`)
  }

  async getMatterRelations (matter) {
    return await fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/relations`)
  }

  async getFullMatter (matter) {
    const texts = await this.getMatterTexts(matter)
    const history = await this.getMatterHistory(matter)
    const sponsors = await this.getMatterSponsors(matter)
    const attachments = await this.getMatterAttachments(matter)
    const codeSections = await this.getMatterCodeSections(matter)
    const relations = await this.getMatterRelations(matter)

    return { ...matter, texts, history, sponsors, attachments, codeSections, relations }
  }
}

