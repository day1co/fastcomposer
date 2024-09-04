// https://ar.al/2021/05/27/make-anything-a-javascript-module-using-node.js-esm-module-loaders/
// this is for test cases running `import … from '…svg?raw'`

import { URL } from 'url'

export default {
  loaders: [
    {
      resolve(specifier, opts) {
        if (specifier.endsWith('.svg')) {
          let { parentURL } = opts
          let url = new URL(specifier, parentURL).href
          return { url }
        }
      },
      format(url, opts) {
        if (url.endsWith('.svg')) {
          return { format: 'module' }
        }
      },
      transform(source, opts) {
        if (opts.url.endsWith('.svg')) {
          return {
            source: `export default ${JSON.stringify(source)}`
          }
        }
      }
    }
  ]
}
