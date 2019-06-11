import {template} from "lodash";

export const restructureLayouts = (layoutKits) => {
  return layoutKits.map(layoutKit => Object.assign(layoutKit, {templateFunc: template(layoutKit.template)}));
};

let _blockIdSeq = 0;
export const uniqueId = () => {
  const seq = (_blockIdSeq = _blockIdSeq  ? ++_blockIdSeq : 1);
  const nonce = Math.random()
    .toString(36)
    .substr(2, 9);
  return `fc-block-${seq}-${nonce}`;
};
