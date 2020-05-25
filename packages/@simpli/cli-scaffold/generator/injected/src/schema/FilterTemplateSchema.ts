/**
 * Filter Schema of <%-model.name%>
 * @author Simpli CLI generator
 */
import {DefaultSchema} from '@/schema/DefaultSchema'
import {FieldSet, FieldComponent} from '@simpli/meta-schema'
import * as Component from '@simpli/vue-input'
import {I<%-collection.name%>ResourcesHolder} from '@/model/collection/<%-collection.name%>'
<%-model.injectIntoDependence().build()%>
<%_ for (var i in model.resolvedPersistDependencies) { var dependence = model.resolvedPersistDependencies[i] _%>
<%-dependence.buildAsCollection()%>
<%_ } _%>

/* unreviewed generated schema */
export class Filter<%-model.name%>Schema extends DefaultSchema implements I<%-collection.name%>ResourcesHolder {
<%_ if (model.resolvedPersistDependencies.length) { _%>
<%-model.buildPersistResourceInstances()%>
<%_ } _%>
  readonly name = 'Filter<%-model.name%>'

  readonly fieldSet: FieldSet<<%-model.name%>> = {
<%-model.buildFilterSchema(collection)%>
  }
}
