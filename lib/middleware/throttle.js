"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

function throttle(ms) {
  return (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      yield pause(ms);
      ctx = yield next(ctx);
      return ctx;
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
}

module.exports = { throttle };