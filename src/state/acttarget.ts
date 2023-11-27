export default interface ActTarget {
  type: string,
  toString(): string,
  isEqual(target: ActTarget): boolean
}
