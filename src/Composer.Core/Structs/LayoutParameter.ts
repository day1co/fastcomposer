import type ListLayoutParameter from './ListLayoutParameter'

export type SingularLayoutParameter = {
  name: string
  description: string
  type: string // oh my god please save me from enum-like devils
  defaultValue?: any
  isRequired?: boolean
}

type LayoutParameter = SingularLayoutParameter | ListLayoutParameter

export default LayoutParameter