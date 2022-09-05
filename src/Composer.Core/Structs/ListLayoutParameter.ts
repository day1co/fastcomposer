import type { SingularLayoutParameter } from './LayoutParameter'
import type LayoutParameter from './LayoutParameter'

type ListLayoutParameter = SingularLayoutParameter & {
  maxLength?: number
  params: Array<SingularLayoutParameter>
}

export default ListLayoutParameter