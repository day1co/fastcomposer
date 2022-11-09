import Vue from 'vue';
import {template} from "lodash";

export const restructureLayouts = (layouts) => {
  for(const layout of layouts) {
    Vue.set(layout, 'templateFunc', template(layout.template))
  }
  return layouts
};

let _blockIdSeq = 0;
export const uniqueId = (prefix = 'fc-block') => {
  const seq = (_blockIdSeq = _blockIdSeq  ? ++_blockIdSeq : 1);
  const nonce = Math.random()
    .toString(36)
    .substr(2, 9);
  return `${prefix}-${seq}-${nonce}`;
};
