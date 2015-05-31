"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;
exports.act = act;

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

function register(fn, m) {
  if (!m.hot) {
    return fn;
  }
  m.hot.data = m.hot.data || {};
  m.hot.data.dhl = m.hot.data.dhl || {};
  var dhl = m.hot.data.dhl;
  m.hot.sIndex = m.hot.sIndex || 0;

  dhl.reduceFns = dhl.reduceFns || [];
  dhl.stores = dhl.stores || [];
  var couched = (function (i) {
    return function (initial, reduce, compare) {
      dhl.reduceFns[i] = reduce;
      if (!dhl.stores[i]) {
        dhl.stores[i] = fn(initial, function () {
          return dhl.reduceFns[i].apply(null, arguments);
        }, compare);
      }
      m.hot.sIndex++;
      return dhl.stores[i];
    };
  })(m.hot.sIndex);

  if (!m.hot.sAttached) {
    m.hot.sAttached = true;
    m.hot.dispose(function (data) {
      Object.assign(data, {
        dhl: {
          reduceFns: dhl.reduceFns,
          stores: dhl.stores
        }
      });
    });
  }

  return couched;
}

function act(fn, m) {
  if (!m.hot) {
    return fn;
  }
  m.hot.data = m.hot.data || {};
  m.hot.data.dhl = m.hot.data.dhl || {};
  var dhl = m.hot.data.dhl;
  m.hot.aIndex = m.hot.aIndex || 0;

  dhl.acts = dhl.acts || [];
  dhl.maps = dhl.maps || [];
  var couched = (function (i) {
    return function (disp, map, prefix) {
      dhl.maps[i] = map;
      if (dhl.acts[i]) {
        return dhl.acts[i];
      } else {
        var acts = dhl.acts[i] = fn(disp, Object.keys(map).reduce(function (o, key) {
          return Object.assign(o, _defineProperty({}, key, function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            if (dhl.maps[i][key]) {
              var _dhl$maps$i;

              return (_dhl$maps$i = dhl.maps[i])[key].apply(_dhl$maps$i, args);
            }
          }));
        }, {}), prefix);
        m.hot.aIndex++;
        return acts;
      }
    };
  })(m.hot.aIndex);

  if (!m.hot.aAttached) {
    m.hot.aAttached = true;
    m.hot.dispose(function (data) {
      Object.assign(data, {
        dhl: {
          acts: dhl.acts,
          maps: dhl.maps
        }
      });
    });
  }
  return couched;
}