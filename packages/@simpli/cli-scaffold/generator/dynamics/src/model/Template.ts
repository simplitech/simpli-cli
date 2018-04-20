/**
 * <%-model.name%>
 * @author Simpli© CLI generator
 */
<%_ for (var i in model.withPathDeps) { var dependence = model.withPathDeps[i] _%>
<%-dependence.build()%>
<%_ } _%>

<%_ for (var i in model.onlyNameDeps) { var dependence = model.onlyNameDeps[i] _%>
<%_ rootOptions.scaffoldSetup.resolvePath(dependence) _%>
<%-dependence.build()%>
<%_ } _%>

export default class <%-model.name%> extends <%-model.isResource ? 'Resource' : 'Model'%> {
<%_ if (model.isResource) { _%>
<%-model.buildResource()%>
<%_ } _%>
<%_ for (var i in model.attrs) { var attr = model.attrs[i] _%>
<%-attr.build()%>
<%_ } _%>
<%_ for (var i in model.apis) { var api = model.apis[i] _%>
<%-api.build()%>
<%_ } _%>
<%_ if (model.isResource) { _%>
<%-model.buildScheme()%>
<%-model.buildScheme(true)%><%_ } _%>}
