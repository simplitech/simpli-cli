import {$} from '@/facade'

export abstract class NavHelper {
  static push(uri: string) {
    return $.router.push(uri)
  }

  static replace(uri: string) {
    return $.router.replace(uri)
  }

  static async pushByName(name: string, ...ids: number[]) {
    const params: any = {}

    if (ids.length > 1) {
      ids.forEach((id, index) => (params[`id${index + 1}`] = id))
    } else if (ids.length === 1) {
      params.id = ids[0]
    }

    await $.router.push({name, params})
  }

  static openUrl(url: string, targetBlank?: boolean) {
    return window.open(url, targetBlank ? '_blank' : '_self')
  }

  static historyBack() {
    return window.history.back()
  }
}
