export function clone(o: object) {
  return structuredClone(o)
}

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
