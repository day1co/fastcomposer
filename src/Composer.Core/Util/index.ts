export function clone(o: object) {
  return o == null? o : JSON.parse(JSON.stringify(o))
}

export function uniqueId() {
  return Math.random().toString()
}
