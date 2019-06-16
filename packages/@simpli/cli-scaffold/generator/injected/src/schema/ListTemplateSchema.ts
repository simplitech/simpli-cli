/**
 * List Schema of <%-model.name%>
 * @author Simpli CLI generator
 */
import {Helper, Schema, FieldSet, FieldComponent, Component} from '@/simpli'
<%-model.injectIntoDependence().build()%>

/* TODO: review generated schema */
export class List<%-model.name%>Schema extends Schema {
  readonly name = 'List<%-model.name%>'

  readonly fieldSet: FieldSet<<%-model.name%>> = {
<%-model.buildListSchema()%>
  }
}
