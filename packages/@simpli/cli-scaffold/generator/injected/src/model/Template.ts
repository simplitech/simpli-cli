<%_ var signIn = rootOptions.scaffoldSetup.auth.api.signIn || {} _%>
<%_ var accountAttrName = rootOptions.scaffoldSetup.auth.accountAttrName _%>
<%_ var passwordAttrName = rootOptions.scaffoldSetup.auth.passwordAttrName _%>
/**
 * <%-model.name%>
 * @author Simpli© CLI generator
 */
<%_ for (var i in model.resolvedDependencies) { var dependence = model.resolvedDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>

/* TODO: review generated class */
export default class <%-model.name%> extends <%-model.isResource ? 'Resource' : 'Model'%> {
<%_ if (model.isResource) { _%>
<%-model.buildResource()%>
<%_ } _%>
<%_ for (var i in model.attrs) { var attr = model.attrs[i] _%>
<%-attr.build()-%>
<%_ if (i < model.attrs.length - 1 || model.apis.length || model.isResource) { _%>

<%_ } _%>
<%_ } _%>
<%_ for (var i in model.apis) { var api = model.apis[i] _%>
<%-api.build(signIn.name, accountAttrName, passwordAttrName)-%>
<%_ if (i < model.apis.length - 1 || model.isResource) { _%>

<%_ } _%>
<%_ } _%>
<%_ if (model.isResource) { _%>
<%-model.buildScheme()%>
<%-model.buildScheme(true)-%>
<%_ } _%>
}
