/**
 * Tag
 * @author martinlabs CRUD generator
 */
import {Resource} from '@/app/http/Resource'
import {ID, TAG} from '@/types/app'
import {ValidationMaxLength, ValidationRequired} from '@/helpers/validation.helper'
import {ResponseSerialize} from '@/helpers/http.helper'

export default class Tag extends Resource {
  readonly $endpoint: string = '/Crud/Tag{/id}'

  idTagPk?: ID = 0

  get $id() {
    return this.idTagPk
  }

  set $id(val: ID) {
    this.idTagPk = val
  }

  get $tag() {
    return this.titulo
  }

  set $tag(val: TAG) {
    this.titulo = val
  }

  @ValidationRequired()
  @ValidationMaxLength(31)
  titulo?: string = ''

  @ResponseSerialize(Tag)
  tagPrincipal: Tag[] = []

  scheme() {
    return {
      idTagPk: this.idTagPk,
      titulo: this.titulo,
    }
  }
}
