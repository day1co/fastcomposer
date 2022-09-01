type LayoutParameter = {
  name: string
  description: string
  type: string // oh my god please save me from enum-like devils
  defaultValue?: any
  isRequired?: boolean
}

export default LayoutParameter