/**
 * List Schema of <%-model.name%>
 * @author Simpli CLI generator
 */
import {$} from '@/facade'
import {DefaultSchema} from '@/schema/DefaultSchema'
import {FieldComponent, FieldSet} from '@simpli/meta-schema'
import * as Component from '@simpli/vue-render-schema'
<%-model.injectIntoDependence().build()%>

/* unreviewed generated schema */
export class List<%-model.name%>Schema extends DefaultSchema {
  readonly name = 'List<%-model.name%>'

  readonly fieldSet: FieldSet<<%-model.name%>> = {
<%-model.buildListSchema()%>
  }
}
