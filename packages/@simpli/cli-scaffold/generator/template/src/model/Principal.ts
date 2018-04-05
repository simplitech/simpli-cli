/**
 * Principal
 * @author martinlabs CRUD generator
 */
import {ID, TAG} from '@/types/app'
import {Resource} from '@/app/http/Resource'
import Tag from '@/model/Tag'
import GrupoDoPrincipal from '@/model/GrupoDoPrincipal'
import ImageRender from '@/app/render/ImageRender'
import AnchorRender from '@/app/render/AnchorRender'
import { bool, date, datetime, cnpj, cpf, phone } from '@/helpers'
import {
  ValidationRequired,
  ValidationEmail,
  ValidationMaxLength,
  ValidationPasswordLength,
} from '@/helpers/validation.helper'
import {ResponseHidden, ResponseSerialize} from '@/helpers/http.helper'

export default class Principal extends Resource {
  readonly $endpoint: string = '/Crud/Principal{/id}'

  idPrincipalPk?: ID = 0

  get $id() {
    return this.idPrincipalPk
  }

  set $id(val: ID) {
    this.idPrincipalPk = val
  }

  get $tag() {
    return this.titulo
  }

  set $tag(val: TAG) {
    this.titulo = val
  }

  @ResponseSerialize(GrupoDoPrincipal)
  grupoDoPrincipal: GrupoDoPrincipal = new GrupoDoPrincipal()

  @ResponseSerialize(GrupoDoPrincipal)
  grupoDoPrincipalFacultativo?: GrupoDoPrincipal = new GrupoDoPrincipal()

  @ValidationRequired()
  textoObrigatorio: string = ''

  textoFacultativo?: string = ''

  @ValidationRequired()
  decimalObrigatorio: number = 0.0

  decimalFacultativo?: number = 0.0

  @ValidationRequired()
  inteiroObrigatorio: number = 0

  inteiroFacultativo?: number = 0

  @ValidationRequired()
  booleanoObrigatorio: boolean = false

  booleanoFacultativo?: boolean = false

  @ValidationRequired()
  dataObrigatoria: string = ''

  dataFacultativa?: string = ''

  @ValidationRequired()
  datahoraObrigatoria: string = ''

  datahoraFacultativa?: string = ''

  @ValidationRequired()
  ativo?: boolean = false

  @ValidationEmail()
  email?: string = ''

  @ValidationPasswordLength(6, 31)
  @ResponseHidden()
  senha?: string = ''

  urlImagem?: string = ''

  url?: string = ''

  unico?: string = ''

  dataCriacao?: string = ''

  dataAlteracao?: string = ''

  @ValidationMaxLength(31)
  nome?: string = ''

  @ValidationMaxLength(31)
  titulo?: string = ''

  cpf?: string = ''

  cnpj?: string = ''

  rg?: string = ''

  celular?: string = ''

  @ValidationMaxLength(255)
  textoGrande?: string = ''

  @ResponseSerialize(Tag)
  tagPrincipal: Tag[] = []

  get idGrupoDoPrincipalFk() {
    return this.grupoDoPrincipal.idGrupoDoPrincipalPk || 0
  }

  set idGrupoDoPrincipalFk(idGrupoDoPrincipalFk: ID) {
    this.grupoDoPrincipal.idGrupoDoPrincipalPk = idGrupoDoPrincipalFk
  }

  get idGrupoDoPrincipalFacultativoFk() {
    if (!this.grupoDoPrincipalFacultativo) return 0
    return this.grupoDoPrincipalFacultativo.idGrupoDoPrincipalPk || 0
  }

  set idGrupoDoPrincipalFacultativoFk(idGrupoDoPrincipalFacultativoFk: ID) {
    if (!this.grupoDoPrincipalFacultativo) this.grupoDoPrincipalFacultativo = new GrupoDoPrincipal()
    this.grupoDoPrincipalFacultativo.idGrupoDoPrincipalPk = idGrupoDoPrincipalFacultativoFk
  }

  scheme() {
    return {
      idPrincipalPk: this.idPrincipalPk,
      grupoDoPrincipal: this.idGrupoDoPrincipalFk,
      grupoDoPrincipalFacultativo: this.idGrupoDoPrincipalFacultativoFk,
      textoObrigatorio: this.textoObrigatorio,
      textoFacultativo: this.textoFacultativo,
      decimalObrigatorio: this.decimalObrigatorio,
      decimalFacultativo: this.decimalFacultativo,
      inteiroObrigatorio: this.inteiroObrigatorio,
      inteiroFacultativo: this.inteiroFacultativo,
      booleanoObrigatorio: bool(this.booleanoObrigatorio),
      booleanoFacultativo: bool(this.booleanoFacultativo),
      dataObrigatoria: date(this.dataObrigatoria),
      dataFacultativa: date(this.datahoraFacultativa),
      datahoraObrigatoria: datetime(this.datahoraObrigatoria),
      datahoraFacultativa: datetime(this.datahoraFacultativa),
      ativo: bool(this.ativo),
      email: this.email,
      urlImagem: new ImageRender(this.urlImagem).toHtml(),
      url: new AnchorRender(this.url, this.url, '_blank').toHtml(),
      unico: this.unico,
      dataCriacao: datetime(this.dataCriacao),
      dataAlteracao: datetime(this.dataAlteracao),
      nome: this.nome,
      titulo: this.titulo,
      cpf: cpf(this.cpf),
      cnpj: cnpj(this.cnpj),
      rg: this.rg,
      celular: phone(this.celular),
      textoGrande: this.textoGrande,
    }
  }

  csvScheme() {
    return {
      idPrincipalPk: this.idPrincipalPk,
      grupoDoPrincipal: this.idGrupoDoPrincipalFk,
      grupoDoPrincipalFacultativo: this.idGrupoDoPrincipalFacultativoFk,
      textoObrigatorio: this.textoObrigatorio,
      textoFacultativo: this.textoFacultativo,
      decimalObrigatorio: this.decimalObrigatorio,
      decimalFacultativo: this.decimalFacultativo,
      inteiroObrigatorio: this.inteiroObrigatorio,
      inteiroFacultativo: this.inteiroFacultativo,
      booleanoObrigatorio: bool(this.booleanoObrigatorio),
      booleanoFacultativo: bool(this.booleanoFacultativo),
      dataObrigatoria: date(this.dataObrigatoria),
      dataFacultativa: date(this.datahoraFacultativa),
      datahoraObrigatoria: datetime(this.datahoraObrigatoria),
      datahoraFacultativa: datetime(this.datahoraFacultativa),
      ativo: bool(this.ativo),
      email: this.email,
      urlImagem: this.urlImagem,
      url: this.url,
      unico: this.unico,
      dataCriacao: datetime(this.dataCriacao),
      dataAlteracao: datetime(this.dataAlteracao),
      nome: this.nome,
      titulo: this.titulo,
      cpf: cpf(this.cpf),
      cnpj: cnpj(this.cnpj),
      rg: this.rg,
      celular: phone(this.celular),
      textoGrande: this.textoGrande,
    }
  }

}
