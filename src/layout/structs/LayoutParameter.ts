export type LayoutParamType = 'text' | 'string' | 'list'
type LayoutParamTypeExpectList = Exclude<LayoutParamType, 'list'>

export type SingularLayoutParameter = {
  name?: string
  label?: string
  description: string
  type: LayoutParamTypeExpectList
  defaultValue?: any
  isRequired?: boolean
}

type L = Omit<SingularLayoutParameter, 'type'> & {
  type: 'list'
  maxLength?: number
}
export type ListLayoutParameter = L & {
  params: Map<string, SingularLayoutParameter>
}
export type LegacyListLayoutParameter = L & {
  params: Array<SingularLayoutParameter>
}

type LayoutParameter = SingularLayoutParameter | ListLayoutParameter
type LegacyLayoutParameter = SingularLayoutParameter | LegacyListLayoutParameter

export default LayoutParameter
export type { LegacyLayoutParameter }
