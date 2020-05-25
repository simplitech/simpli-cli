/**
 * Input Schema of <%-model.name%>
 * @author Simpli CLI generator
 */
import {DefaultSchema} from '@/schema/DefaultSchema'
import {FieldSet, FieldComponent} from '@simpli/meta-schema'
import * as Component from '@simpli/vue-input'
<%-model.injectIntoDependence().build()%>
<%_ for (var i in model.resolvedPersistDependencies) { var dependence = model.resolvedPersistDependencies[i] _%>
<%-dependence.buildAsCollection()%>
<%_ } _%>

/* unreviewed generated schema */
export class Input<%-model.name%>Schema extends DefaultSchema {
<%_ if (model.resolvedPersistDependencies.length) { _%>
<%-model.buildPersistResourceInstances()%>
<%_ } _%>
  readonly name = 'Input<%-model.name%>'

  readonly fieldSet: FieldSet<<%-model.name%>> = {
<%-model.buildInputSchema()%>
  }
}
