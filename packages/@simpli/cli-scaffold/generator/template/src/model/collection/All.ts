/**
 * Alias of PagedResp
 * Used to get all items from a paged list response
 * @author Simpli CLI generator
 */
import {Resource} from '@/simpli'
import PagedResp from '@/model/collection/PagedResp'

export default class All<T extends Resource> extends PagedResp<T> {
  // Get all items from a paged list response
  constructor(public type: typeof Resource) {
    super(type, {}, null, null)
  }
}
