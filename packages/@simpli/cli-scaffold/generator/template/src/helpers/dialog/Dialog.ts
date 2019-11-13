import {$} from 'simpli-web-sdk'

export class Dialog {
  title: string = ''
  message: string | null = null
  confirmText: string | null = null
  cancelText: string | null = null
  confirmClass: string | null = null
  cancelClass: string | null = null

  onConfirm: Function = () => {/**/}
  onCancel: Function = () => {/**/}

  constructor() {
    this.confirmText = $.t('app.confirm') as string
    this.confirmClass = 'btn btn--contrast bg-secondary'

    this.cancelText = $.t('app.cancel') as string
    this.cancelClass = 'btn btn--flat'
  }

  async confirm<R>(onConfirm?: (dialog: this) => Promise<R>, onCancel?: () => void) {
    $.modal.open('dialog', this)

    return new Promise<R>((resolve, reject) => {
      this.onConfirm = async () => {
        const resp = await onConfirm?.(this)
        resolve(resp)
      }

      this.onCancel = () => {
        onCancel?.()
        reject(`Denied operation: ${this.title}`)
      }
    })
  }
}
