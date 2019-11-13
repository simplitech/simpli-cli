import {$, Resource} from 'simpli-web-sdk'
import {Dialog} from '@/helpers/dialog/Dialog'

export class DialogRemove extends Dialog {
  constructor(public resource: Resource) {
    super()
    this.title = $.t('system.question.confirmRemove') as string
    this.message = resource.$tag
  }
}
