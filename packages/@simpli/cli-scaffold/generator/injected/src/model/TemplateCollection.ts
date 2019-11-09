/**
 * <%-model.name%>
 *
 * @author Simpli CLI generator
 */
import {PageCollection, HttpExclude, Request} from 'simpli-web-sdk'
<%_ for (var i in model.resolvedPersistDependencies) { var dependence = model.resolvedPersistDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>

/* TODO: review generated class */
@HttpExclude()
export class <%-model.name%> extends PageCollection<<%-model.itemModelName%>> {
  constructor() {
    super(<%-model.itemModelName%>)
  }

<%_ if (model.apis.length >= 1) { _%>
  queryAsPage() {
    return this.<%-model.apis[0].name%>()
  }

<%_ } _%>
<%_ for (var i in model.apis) { var api = model.apis[i] _%>
<%-api.buildInCollection()-%>
<%_ if (i < model.apis.length - 1) { _%>

<%_ } _%>
<%_ } _%>
}
