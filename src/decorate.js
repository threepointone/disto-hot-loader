export function register(fn, m){
  if(!m.hot){
    return fn;
  }
  m.hot.data = m.hot.data || {};
  m.hot.data.dhl = m.hot.data.dhl || {};
  let dhl = m.hot.data.dhl;
  m.hot.sIndex = m.hot.sIndex || 0;

  dhl.reduceFns = dhl.reduceFns || [];
  dhl.stores = dhl.stores || [];
  let couched = (initial, reduce, compare) => (i => {
    dhl.reduceFns[i] = reduce;
    if(!dhl.stores[i]){
      dhl.stores[i] = fn(initial, function(){
        return dhl.reduceFns[i].apply(null, arguments);
      }, compare);
    }
    m.hot.sIndex++;
    return dhl.stores[i];

  })(m.hot.sIndex);

  if(!m.hot.sAttached){
    m.hot.sAttached = true;
    m.hot.addDisposeHandler(data => {
      Object.assign(data, {
        dhl: {
          ...data.dhl,
          reduceFns: dhl.reduceFns,
          stores: dhl.stores
        }
      });
    });
  }

  return couched;

}

export function act(fn, m){
  if(!m.hot){
    return fn;
  }
  m.hot.data = m.hot.data || {};
  m.hot.data.dhl = m.hot.data.dhl || {};
  let dhl = m.hot.data.dhl;
  m.hot.aIndex = m.hot.aIndex || 0;

  dhl.acts = dhl.acts || [];
  dhl.maps = dhl.maps || [];
  let couched = (disp, map, prefix) => {
    return (i => {
      dhl.maps[i] = map;
      if(!dhl.acts[i]){
        dhl.acts[i] = fn(disp, Object.keys(map).reduce((o, key)=>{
          return Object.assign(o, {[key]: function(...args){
            if(dhl.maps[i][key]){
              return dhl.maps[i][key](...args);
            }
          }});
        }, {}), prefix);
      }

      m.hot.aIndex++;
      return dhl.acts[i];

    })(m.hot.aIndex);

  };

  if(!m.hot.aAttached){
    m.hot.aAttached = true;
    m.hot.addDisposeHandler(data => {
      Object.assign(data, {
        dhl: {
          ...data.dhl,
          acts: dhl.acts,
          maps: dhl.maps
        }
      });
    });
  }
  return couched;
}
