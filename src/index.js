import { promisifiedRequest } from './middleware/request'

const RESULTS_PER_PAGE = 1000

export default class LegistarClient {
  constructor (client, request) {
    this.request = request || promisifiedRequest
    this.client = client
    this.URL_BASE = `http://webapi.legistar.com/v1/${client}`
  }

  async fetchFromLegistar (url, acc = [], currentPage = 0) {
    const skip = RESULTS_PER_PAGE * currentPage
    const { response } = await this.request({ url: `${url}?$skip=${skip}` })
    const items = JSON.parse(response)
    acc = acc.concat(items)

    if (items.length === RESULTS_PER_PAGE) {
      acc = this.fetchFromLegistar(url, acc, currentPage + 1)
    }

    return acc
  }

  async getAllMatters () {
    return await this.fetchFromLegistar(`${this.URL_BASE}/matters`)
  }

  async getMatterHistory (matter) {
    return await this.fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/histories`)
  }

  async getMatterTexts (matter) {
    const versions = await this.fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/versions`)
    let texts = []
    for (const version of versions) {
      const text = await this.fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/texts/${version.Key}`)
      texts = texts.concat(text)
    }
    return texts
  }

  async getMatterSponsors (matter) {
    return await this.fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/sponsors`)
  }

  async getMatterAttachments (matter) {
    return await this.fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/attachments`)
  }

  async getMatterCodeSections (matter) {
    return await this.fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/codesections`)
  }

  async getMatterRelations (matter) {
    return await this.fetchFromLegistar(`${this.URL_BASE}/matters/${matter.MatterId}/relations`)
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

