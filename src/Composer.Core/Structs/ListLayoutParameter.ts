import type { SingularLayoutParameter } from './LayoutParameter'
import type LayoutParameter from './LayoutParameter'

type ListLayoutParameter = SingularLayoutParameter & {
  maxLength?: number
  params: Map<string, SingularLayoutParameter>
}

export default ListLayoutParameter
