'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function promisifiedRequest(ctx) {
  console.warn('fetching', ctx.url);
  return new Promise((resolve, reject) => {
    _superagent2.default.get(ctx.url).end((err, res) => {
      if (err) {
        return reject(err);
      }

      ctx = _lodash2.default.assign(ctx, { response: res.text });

      resolve(ctx);
    });
  });
}

module.exports = { promisifiedRequest };