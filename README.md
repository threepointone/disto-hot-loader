disto-hot-loader
---

(beta)

hot load your [disto](https://github.com/threepointone/disto) stores and actions

`npm install disto-hot-loader --save-dev`

and add `disto-hot` to your webpack config's loaders.

like so - `loaders: ['react-hot', 'disto-hot', 'babel-loader']`

bugs
---

- instead of `import {Dis, act} from 'disto'`, need to do `let {Dis, act} = require('disto')`
- don't name any of your own functions `register` or `act` (or rename them before making the call)
- adding/removing/swapping stores *might* need a reload.
- source maps are a bit wonky
- needs tests (how does one test a hot-loader?)
