/**
 * <%-model.name%>
 * @author Simpli© CLI generator
 */
import {ID, TAG, Resource, ImageRender, AnchorRender} from '@/simpli'
import {
  ValidationRequired,
  ValidationEmail,
  ValidationMaxLength,
  ValidationPasswordLength,
} from '@/simpli'
import {ResponseHidden, ResponseSerialize} from '@/simpli'
import { bool, date, datetime, cnpj, cpf, phone } from '@/simpli'

import Tag from '@/model/resource/Tag'
import GrupoDoPrincipal from '@/model/resource/GrupoDoPrincipal'

export default class <%-model.name%> extends Resource {
  readonly $endpoint: string = '<%-model.endpoint%>'

<%_ if (model.keyID) { _%>
  <%-model.keyID%>?: ID = 0

<%_ } _%>
  get $id() {
<%_ if (model.keyID) { _%>
    return this.<%-model.keyID%>
<%_ } else { _%>
    return 0
<%_ } _%>
  }

  set $id(val: ID) {
<%_ if (model.keyID) { _%>
    this.<%-model.keyID%> = val
<%_ } _%>
  }

<%_ if (model.keyTAG) { _%>
  get $tag() {
    return this.<%-model.keyTAG%>
  }

  set $tag(val: TAG) {
    this.<%-model.keyTAG%> = val
  }

<%_ } _%>
<%_ for (var i in model.attrs) { var attr = model.attrs[i] _%>
<%_ if (attr.name === model.keyID) continue _%>
  <%_ for (var j in attr.responses()) { var response = attr.responses()[j] _%>
  @<%-response.title%>(<%-response.attr%>)
  <%_ } _%>
  <%_ for (var j in attr.validations()) { var validation = attr.validations()[j] _%>
  @<%-validation.title%>(<%-validation.attr%>)
  <%_ } _%>
  <%-attr.name%><%-attr.reqStr()%>: <%-attr.types()%> = <%-attr.defaults()%>

<%_ } _%>

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
