/**
 * <%-model.name%>
 * @author Simpli© CLI generator
 */
<%_ for (var i in model.dependencies) { var dependence = model.dependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>

export default class <%-model.name%> extends <%-model.isResource ? 'Resource' : 'Model'%> {
<%-model.buildResource()%>
<%_ for (var i in model.attrs) { var attr = model.attrs[i] _%>
<%-attr.build()%>
<%_ } _%>
<%_ for (var i in model.apis) { var api = model.apis[i] _%>
<%-api.build()%>
<%_ } _%>
<%-model.buildScheme()%>
<%-model.buildScheme(true)%>
}
