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

  open() {
    $.modal.open('dialog', this)
  }

  close() {
    $.modal.close('dialog')
  }
}
