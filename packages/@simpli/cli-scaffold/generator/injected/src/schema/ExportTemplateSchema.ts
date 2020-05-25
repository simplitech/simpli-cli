/**
 * Export Schema of <%-model.name%>
 * @author Simpli CLI generator
 */
import {$} from '@/facade'
import {DefaultSchema} from '@/schema/DefaultSchema'
import {FieldSet} from '@simpli/meta-schema'
<%-model.injectIntoDependence().build()%>

/* unreviewed generated schema */
export class Export<%-model.name%>Schema extends DefaultSchema {
  readonly name = 'Export<%-model.name%>'

  readonly fieldSet: FieldSet<<%-model.name%>> = {
<%-model.buildCsvSchema()%>
  }
}
