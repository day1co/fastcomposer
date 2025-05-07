export function uniqueId() {
  return Math.random().toString(36).slice(2, 10)
}

export function iconToUri(icon) {
  if(!icon)
    return
  else if(/^<(?:\?xml |svg )/.test(icon))
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(icon)
  else if(/^data:image\//.test(icon))
    return icon
  else
    return null
}

export const html = {
  lint(value: string) {
    const el = document.createElement('div')
    el.innerHTML = value
    return el.innerHTML
  },

  validate(value: any) {
    if(typeof value !== 'string')
      return true

    try {
      // <hr /> closes <p>
      const doc = new DOMParser().parseFromString(value + '<hr>', 'text/html')
      if(doc.querySelector('parseerror'))
        return false
      if((<HTMLElement>doc.body.lastChild).tagName !== 'HR')
        return false
    } catch(e) {
      return false
    }

    return true
  },

  validateLegacy(value: any) {
    const selfClosingTags = ['img', 'br', 'hr'];

    let tags = typeof value === 'string' ? <Array<any>>value.match(/(<([^>]+)>)/igm) : null;

    if (tags) {
      tags = tags.map((tag) => tag.replace(/ .*?=('*.*'?|"*.*"?)/gim,'>'));

      return tags.every((tag, index, array) => {
        const tagName = tag.match(/[A-Z0-9]/gim).join('')
        const openingLen = array.filter((item) => `<${ tagName }>` === item).length
        const closingLen = array.filter((item) => `</${ tagName }>` === item).length
        const hasSelfClosingTagLen = selfClosingTags.filter((item) => item === tagName).length

        return openingLen === closingLen || hasSelfClosingTagLen
      })
    } else return true
  }
}
