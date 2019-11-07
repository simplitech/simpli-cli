/**
 * Input Schema of <%-model.name%>
 * @author Simpli CLI generator
 */
import {Schema, FieldSet, FieldComponent, Component} from '@/simpli'
<%-model.injectIntoDependence().build()%>
<%_ for (var i in model.resolvedPersistDependencies) { var dependence = model.resolvedPersistDependencies[i] _%>
<%-dependence.buildAsCollection()%>
<%_ } _%>

/* TODO: review generated schema */
export class Input<%-model.name%>Schema extends Schema {
<%_ if (model.resolvedPersistDependencies.length) { _%>
<%-model.buildPersistResourceInstances()%>
<%_ } _%>
  readonly name = 'Input<%-model.name%>'

  readonly fieldSet: FieldSet<<%-model.name%>> = {
<%-model.buildInputSchema()%>
  }
}
