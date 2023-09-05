export function clone(o: object) {
  return structuredClone(o)
}

export function uniqueId() {
  return Math.random().toString(36).slice(2, 10)
}
