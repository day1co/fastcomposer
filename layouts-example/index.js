import * as ComposerLayout from '../src/layout'
import LegacyLayout from '../src/layout/legacy'

const imports = Object.values({
  ...import.meta.glob('./*/index.js', { eager: true }),
  ...import.meta.glob('../layouts/*/index.js', { eager: true }),
  ...import.meta.glob('./*/index.jsx', { eager: true }),
  ...import.meta.glob('./*/index.ts', { eager: true }),
  // ...import.meta.glob('./*/index.tsx', { eager: true })
})

const layouts = new Map()

for(let module of imports) {
  const layout = module.default

  if(!layout._specVersion || layout._specVersion < 2) {
    layouts.set(layout.id, LegacyLayout.fromDefinition(layout))
  } else {
    layouts.set(layout.id, layout)
  }
}

export default layouts
