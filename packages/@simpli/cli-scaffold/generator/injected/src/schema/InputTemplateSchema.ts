/**
 * Input Schema of <%-model.name%>
 * @author Simpli CLI generator
 */
import {AjvType, Schema, FieldSet, FieldComponent, Component} from '@/simpli'
<%-model.injectIntoDependence().build()%>

/* TODO: review generated schema */
export class Input<%-model.name%>Schema extends Schema {
  readonly name = 'Input<%-model.name%>'

  readonly fieldSet: FieldSet<<%-model.name%>> = {
<%-model.buildInputSchema()%>
  }
}
