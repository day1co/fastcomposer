import marked from 'marked';
import { restructureLayouts } from '../utils/utils';

export const render = (layouts, layers) => {
  const templates = restructureLayouts(layouts).reduce((result, layout) => {
    result[layout.id] = layout.templateFunc;
    return result;
  }, {});
  console.log(templates);
  console.log(layers);
  return layers
    .map(
      layer => `
            <section class="fc-block fc-layout fc-layout-${layer.layout}">
              ${templates[layer.layout]({ $markdown: marked, ...layer.values })}
            </section>`
    )
    .join('\n');
};
