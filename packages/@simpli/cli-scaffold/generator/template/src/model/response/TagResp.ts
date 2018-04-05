/**
 * TagResp
 * @author martinlabs CRUD generator
 */
import {Resource} from '@/app/http/Resource'
import Tag from '@/model/Tag'
import Principal from '@/model/Principal'
import {ResponseSerialize} from '@/helpers/http.helper'
import {ID, TAG} from '@/types/app'

export default class TagResp extends Resource {
  readonly $endpoint: string = '/Crud/Tag{/id}'

  @ResponseSerialize(Tag)
  tag: Tag = new Tag()

  @ResponseSerialize(Principal)
  allPrincipal: Principal[] = []

  get $id() {
    return this.tag.$id
  }

  set $id(val: ID) {
    this.tag.$id = val
  }

  get $tag() {
    return this.tag.$tag
  }

  set $tag(val: TAG) {
    this.tag.$tag = val
  }
}
