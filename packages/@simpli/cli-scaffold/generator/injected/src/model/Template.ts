<%_ var auth = rootOptions.scaffoldSetup.auth _%>
/**
 * <%-model.name%>
<%_ if (model.description) { _%>
 * Note: <%-model.description%>
 *
<%_ } _%>
 * @author Simpli CLI generator
 */
<%_ for (var i in model.resolvedDependencies) { var dependence = model.resolvedDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>
<%_ if (model.isRequest) { _%>
<%-model.injectSchemaIntoDependence('Input', false).build()%>
<%_ } _%>

/* TODO: review generated class */
export class <%-model.name%> extends <%-model.isResource ? 'Resource' : 'Model'%> {
<%_ if (model.isResource) { _%>
<%-model.buildResource()%>
<%_ } _%>
<%_ for (var i in model.attrs) { var attr = model.attrs[i] _%>
<%-attr.build()-%>
<%_ if (i < model.attrs.length - 1 || model.apis.length || model.isResource) { _%>

<%_ } _%>
<%_ } _%>
<%_ for (var i in model.apis) { var api = model.apis[i] _%>
<%-api.build(auth)-%>
<%_ if (i < model.apis.length - 1) { _%>

<%_ } _%>
<%_ } _%>
}
