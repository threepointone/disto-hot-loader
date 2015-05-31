export function register(fn, m){
  if(!m.hot){
    return fn;
  }
  var {dhl} = m.hot.data = m.hot.data || {};
  dhl.sIndex = dhl.sIndex || 0;

  dhl.reduceFns = dhl.reduceFns || [];
  dhl.stores = dhl.stores || [];
  (i => (initial, reduce, compare) => {
    dhl.sIndex++;
    dhl.reduceFns[i] = reduce;
    if(!dhl.stores[i]){
      dhl.stores[i] = fn(initial, function(){
        return dhl.reduceFns[i].apply(null, arguments);
      }, compare);
    }

    return dhl.stores[i];

  })(dhl.sIndex);

  if(!dhl.sAttached){
    dhl.sAttached = true;
    module.hot.dispose(data => {
      Object.assign(data, {
        dhl: {
          reduceFns: dhl.reduceFns,
          stores: dhl.stores
        }
      });
    });
  }

}

export function act(fn, m){
  if(!m.hot){
    return fn;
  }
  var {dhl} = m.hot.data = m.hot.data || {};
  dhl.aIndex = dhl.aIndex || 0;

  dhl.acts = dhl.acts || [];
  dhl.maps = dhl.maps || [];
  (i => (disp, map, prefix) => {
    dhl.maps[i] = map;
    if(dhl.acts[i]){
      return dhl.acts[i];
    }
    else {
      const acts = dhl.acts[i] = fn(disp, Object.keys(map).reduce((o, key)=>{
        return Object.assign(o, {[key]: function(...args){
          if(dhl.maps[i][key]){
            return dhl.maps[i][key](...args);
          }
        }});
      }, {}), prefix);
      dhl.aIndex++;
      return acts;
    }

  })(dhl.aIndex);

  if(!dhl.aAattached){
    dhl.Attached = true;
    module.hot.dispose(data => {
      Object.assign(data, {
        dhl: {
          acts: dhl.acts,
          maps: dhl.maps
        }
      });
    });
  }
}