import {template} from "lodash";

export const restructureLayoutKit = (layoutKits) => {
  return layoutKits.map(layoutKit => Object.assign(layoutKit, {templateFunc: template(layoutKit.template)}));
};
