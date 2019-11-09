/**
 * Csv Schema of <%-model.name%>
 * @author Simpli CLI generator
 */
import {Helper, Schema, FieldSet} from 'simpli-web-sdk'
<%-model.injectIntoDependence().build()%>

/* TODO: review generated schema */
export class Csv<%-model.name%>Schema extends Schema {
  readonly name = 'Csv<%-model.name%>'

  readonly fieldSet: FieldSet<<%-model.name%>> = {
<%-model.buildCsvSchema()%>
  }
}
