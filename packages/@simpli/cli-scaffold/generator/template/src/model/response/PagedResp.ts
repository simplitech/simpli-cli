import PageCollection from '@/app/http/PageCollection'
import {Resource} from '@/app/http/Resource'
import {Type} from 'class-transformer'
import {ResponseFill} from '@/helpers/http.helper'

export default class PagedResp<T extends Resource> extends PageCollection<T> {
  @ResponseFill('list')
  @Type((options) => (options!.newObject as PagedResp<T>).type)
  items: T[] = []

  set recordsTotal(val: number) {
    this.total = val
  }
}

