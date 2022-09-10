export function clone(o: object) {
  return JSON.parse(JSON.stringify(o))
}

export function uniqueId() {
  return Math.random().toString()
}
