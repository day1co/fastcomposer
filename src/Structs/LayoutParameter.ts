export type LayoutType = 'text' | 'string' | 'list'
type LayoutTypeExceptsList = Exclude<LayoutType, 'list'>

export type SingularLayoutParameter = {
  name?: string
  description: string
  type: LayoutTypeExceptsList
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
