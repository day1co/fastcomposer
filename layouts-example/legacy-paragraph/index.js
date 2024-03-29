import layout from './layout.json'
import template from './template.ejs?raw'
import style from './style.scss'
import icon from './icon.svg'

export default Object.assign(layout, {
  template,
  style,
  icon
})
