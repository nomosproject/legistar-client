'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let fetchFromLegistar = (() => {
  var _ref = _asyncToGenerator(function* (url, acc = [], currentPage = 0) {
    const skip = RESULTS_PER_PAGE * currentPage;
    const { response } = yield request({ url: `${ url }?$skip=${ skip }` });
    const items = JSON.parse(response);
    acc = acc.concat(items);

    if (items.length === RESULTS_PER_PAGE) {
      acc = fetchFromLegistar(url, acc, currentPage + 1);
    }

    return acc;
  });

  return function fetchFromLegistar(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _cache = require('./middleware/cache');

var _request = require('./middleware/request');

var _throttle = require('./middleware/throttle');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const request = (0, _koaCompose2.default)([(0, _cache.useFilesystemCache)({ directory: '.cache' }), (0, _throttle.throttle)(250), _request.promisifiedRequest]);

const RESULTS_PER_PAGE = 1000;
class LegistarClient {
  constructor(client) {
    this.client = client;
    this.URL_BASE = `http://webapi.legistar.com/v1/${ client }`;
  }

  getAllMatters() {
    var _this = this;

    return _asyncToGenerator(function* () {
      return yield fetchFromLegistar(`${ _this.URL_BASE }/matters`);
    })();
  }

  getMatterHistory(matter) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return yield fetchFromLegistar(`${ _this2.URL_BASE }/matters/${ matter.MatterId }/histories`);
    })();
  }

  getMatterTexts(matter) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const versions = yield fetchFromLegistar(`${ _this3.URL_BASE }/matters/${ matter.MatterId }/versions`);
      let texts = [];
      for (const version of versions) {
        const text = yield fetchFromLegistar(`${ _this3.URL_BASE }/matters/${ matter.MatterId }/texts/${ version.Key }`);
        texts = texts.concat(text);
      }
      return texts;
    })();
  }

  getMatterSponsors(matter) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return yield fetchFromLegistar(`${ _this4.URL_BASE }/matters/${ matter.MatterId }/sponsors`);
    })();
  }

  getMatterAttachments(matter) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      return yield fetchFromLegistar(`${ _this5.URL_BASE }/matters/${ matter.MatterId }/attachments`);
    })();
  }

  getMatterCodeSections(matter) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      return yield fetchFromLegistar(`${ _this6.URL_BASE }/matters/${ matter.MatterId }/codesections`);
    })();
  }

  getMatterRelations(matter) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      return yield fetchFromLegistar(`${ _this7.URL_BASE }/matters/${ matter.MatterId }/relations`);
    })();
  }

  getFullMatter(matter) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const texts = yield _this8.getMatterTexts(matter);
      const history = yield _this8.getMatterHistory(matter);
      const sponsors = yield _this8.getMatterSponsors(matter);
      const attachments = yield _this8.getMatterAttachments(matter);
      const codeSections = yield _this8.getMatterCodeSections(matter);
      const relations = yield _this8.getMatterRelations(matter);

      return _extends({}, matter, { texts, history, sponsors, attachments, codeSections, relations });
    })();
  }
}
exports.default = LegistarClient;