import request from 'superagent'
import _ from 'lodash'

function promisifiedRequest (ctx) {
  console.warn('fetching', ctx.url)
  return new Promise((resolve, reject) => {
    request.get(ctx.url).end((err, res) => {
      if (err) { return reject(err) }

      ctx = _.assign(ctx, { response: res.text })

      resolve(ctx)
    })
  })
}

module.exports = { promisifiedRequest }
