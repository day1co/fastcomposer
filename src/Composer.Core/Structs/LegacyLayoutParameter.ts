import type { SingularLayoutParameter } from './LayoutParameter'

type LegacyLayoutParameter = SingularLayoutParameter & {
  maxLength?: number
  params: Array<LegacyLayoutParameter>
}

export default LegacyLayoutParameter
