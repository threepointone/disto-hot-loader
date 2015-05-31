var src = `
import {act} from 'disto';

register(1, 2);

dis.register(1, 2);

x = act(what, {});

`;

import transform from './src/parse';

console.log(transform(src));
