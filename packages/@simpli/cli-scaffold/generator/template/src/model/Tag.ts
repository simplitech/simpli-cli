/**
 * Tag
 * @author martinlabs CRUD generator
 */
import {ID, TAG, Resource} from '@/simpli'
import {ValidationMaxLength, ValidationRequired} from '@/simpli'
import {ResponseSerialize} from '@/simpli'

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

