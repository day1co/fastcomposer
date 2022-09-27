import type { SingularLayoutParameter } from './LayoutParameter'

type ListLayoutParameter = SingularLayoutParameter & {
  maxLength?: number
  params: Map<string, SingularLayoutParameter>
}

export default ListLayoutParameter
