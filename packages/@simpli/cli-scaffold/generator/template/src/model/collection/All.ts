/**
 * Alias of PagedResp
 * Used to get all items from a paged list response
 * @author Simpli CLI generator
 */
import {Resource, ClassType} from '@/simpli'
import PagedResp from '@/model/collection/PagedResp'

export default class All<T extends Resource> extends PagedResp<T> {
  // Get all items from a paged list response
  constructor(public type: ClassType<T>) {
    super(type, {}, null, null)
  }
}
