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

/* TODO: review generated class */
export class <%-model.name%> extends <%-model.isResource ? 'Resource' : 'Model'%> {
<%-model.buildIdsAttr()-%>
<%-model.buildModelAttrs()-%>
<%-model.buildDescriptionsAttrs()-%>
<%-model.buildRequiredAndNotDescriptionAttrs()-%>
<%-model.buildSimpleAttrs()-%>
<%-model.buildPasswordAttrs()-%>
<%-model.buildResource()%>
<%-model.buildForeignAttrs()-%>
<%-model.buildApis(auth)%>
}
