import layout from './layout.json';
import template from './template.ejs?raw';
import style from './style.scss?inline';
import icon from './icon.svg?raw';

export default Object.assign(layout, {
  template,
  style,
  icon
});
