/**
 * <%-model.name%>
 *
 * @author Simpli CLI generator
 */
<%_ for (var i in model.resolvedDependencies) { var dependence = model.resolvedDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>
<%_ for (var i in itemModel.resolvedPersistDependencies) { var dependence = itemModel.resolvedPersistDependencies[i] _%>
<%-dependence.buildAsCollection()%>
<%_ } _%>

/* unreviewed generated class */
@HttpExclude()
export class <%-model.name%> extends PageCollection<<%-itemModel.name%>> {
  constructor() {
    super(<%-itemModel.name%>)
  }

  resource?: I<%-model.name%>ResourcesHolder

<%-model.buildCollectionFields()-%>

<%-model.buildCollectionForeignAttrs(itemModel)-%>
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

export interface I<%-model.name%>ResourcesHolder {
  <%-itemModel.buildPersistResourceDeclares()-%>
}
