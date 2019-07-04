import layout from './layout.json';
import template from 'raw-loader!./template.ejs';
import style from './style.scss';
import icon from './icon.svg';

export default Object.assign(layout, {
  template,
  style,
  icon
});
