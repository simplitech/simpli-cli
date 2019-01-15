/**
 * PagedResp
 * Alias of PageCollection class adapted to server response
 * @author Simpli CLI generator
 */
import {PageCollection, Resource, ResponseFill} from '@/simpli'
import {Type} from 'class-transformer'

export default class PagedResp<T extends Resource> extends PageCollection<T> {
  @ResponseFill('list')
  @Type((options) => (options!.newObject as PagedResp<T>).type)
  items: T[] = []

  set recordsTotal(val: number) {
    this.total = val
  }
}

