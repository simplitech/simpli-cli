<%_ if (model.isResource) { _%>
/**
 * Schema of <%-model.name%>
 * @author Simpli CLI generator
 */
<%_ for (var i in model.resolvedSchemaDependencies) { var dependence = model.resolvedSchemaDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>

/* TODO: review generated schema */
export default (model: <%-model.name%>): Schema => ({
<%-model.buildSchema()%>
})
<%_ } _%>