/**
 * PagedResp
 * Alias of PageCollection class adapted to server response
 * @author Simpli CLI generator
 */
import {PageCollection, Resource, ResponseFill, ClassType} from '@/simpli'
import {Type} from 'class-transformer'

export default class PagedResp<R extends Resource> extends PageCollection<R> {
  @ResponseFill('list')
  @Type((options) => (options!.newObject as PagedResp<R>).type)
  items: R[] = []

  constructor(type: ClassType<R>, filter = {}, perPage: number | null = 20, currentPage: number | null = 0) {
    super(type, filter, perPage, currentPage)
  }

  set recordsTotal(val: number) {
    this.total = val
  }
}
