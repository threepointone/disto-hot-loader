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

  var _m$hot$data = m.hot.data = m.hot.data || {};

  var dhl = _m$hot$data.dhl;

  dhl.sIndex = dhl.sIndex || 0;

  dhl.reduceFns = dhl.reduceFns || [];
  dhl.stores = dhl.stores || [];
  (function (i) {
    return function (initial, reduce, compare) {
      dhl.sIndex++;
      dhl.reduceFns[i] = reduce;
      if (!dhl.stores[i]) {
        dhl.stores[i] = fn(initial, function () {
          return dhl.reduceFns[i].apply(null, arguments);
        }, compare);
      }

      return dhl.stores[i];
    };
  })(dhl.sIndex);

  if (!dhl.sAttached) {
    dhl.sAttached = true;
    module.hot.dispose(function (data) {
      Object.assign(data, {
        dhl: {
          reduceFns: dhl.reduceFns,
          stores: dhl.stores
        }
      });
    });
  }
}

function act(fn, m) {
  if (!m.hot) {
    return fn;
  }

  var _m$hot$data2 = m.hot.data = m.hot.data || {};

  var dhl = _m$hot$data2.dhl;

  dhl.aIndex = dhl.aIndex || 0;

  dhl.acts = dhl.acts || [];
  dhl.maps = dhl.maps || [];
  (function (i) {
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
        dhl.aIndex++;
        return acts;
      }
    };
  })(dhl.aIndex);

  if (!dhl.aAattached) {
    dhl.Attached = true;
    module.hot.dispose(function (data) {
      Object.assign(data, {
        dhl: {
          acts: dhl.acts,
          maps: dhl.maps
        }
      });
    });
  }
}