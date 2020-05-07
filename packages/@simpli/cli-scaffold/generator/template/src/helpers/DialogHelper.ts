import {Vue} from 'vue-property-decorator'
import {SweetAlertOptions, SweetAlertResult} from 'sweetalert2'
import {$} from '@/facade'
import {IResource} from '@simpli/resource-collection'
import {EnvHelper} from '@/helpers/EnvHelper'

export abstract class DialogHelper {
  static swalConfirm(options: SweetAlertOptions): Promise<SweetAlertResult> {
    return new Promise(resolve => {
      Vue.swal(options).then(shouldRemove => {
        if (shouldRemove.value) {
          resolve(shouldRemove)
        }
      })
    })
  }

  static async remove(resource: IResource) {
    await this.swalConfirm({
      title: $.t('system.question.confirmRemove') as string,
      text: resource.$tag,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: EnvHelper.DANGER_COLOR,
      cancelButtonColor: EnvHelper.PRIMARY_COLOR,
      confirmButtonText: $.t('system.question.yesRemove') as string,
    })
  }
}
