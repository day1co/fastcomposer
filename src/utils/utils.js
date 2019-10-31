import {template} from "lodash";

export const restructureLayouts = (layouts) => {
  return layouts.map(layout => Object.assign(layout, {templateFunc: template(layout.template)}));
};

let _blockIdSeq = 0;
export const uniqueId = () => {
  const seq = (_blockIdSeq = _blockIdSeq  ? ++_blockIdSeq : 1);
  const nonce = Math.random()
    .toString(36)
    .substr(2, 9);
  return `fcc-block-${seq}-${nonce}`;
};
