disto-hot-loader
---

hot load your [disto](https://github.com/threepointone/disto) stores

(and soon, actions!)

`npm install disto-hot-loader`

and add `disto-hot` to your webpack config's loaders.

like so - `loaders: ['react-hot', 'disto-hot', 'babel-loader']`

caveats/bugs
---

- don't name any of your own functions `register`.
- adding/removing/swapping stores might need a reload.