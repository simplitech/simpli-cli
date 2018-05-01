<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.response

import io.swagger.annotations.ApiModelProperty
import <%-packageAddress%>.model.<%-table.modelName%>
<%_ for (var i in table.validDistinctRelations) { var relation = table.validDistinctRelations[i] _%>
import <%-packageAddress%>.model.<%-relation.referencedTableModelName%>
<%_ } _%>

/**
 * Response of model <%-table.modelName%>
 * @author Simpli© CLI generator
 */
class <%-table.modelName%>Resp {
    var <%-table.instanceName%>: <%-table.modelName%>? = null
<%_ if (table.validDistinctRelations.length !== 0) { _%>

<%_ } _%>
<%_ for (var i in table.validDistinctRelations) { var relation = table.validDistinctRelations[i] _%>
    @ApiModelProperty(value = "Possible <%-relation.referencedTableModelName%> values")
    var all<%-relation.referencedTableModelName%>: MutableList<<%-relation.referencedTableModelName%>>? = null
<%_ if (i < table.validDistinctRelations.length - 1) { _%>

<%_ } _%>
<%_ } _%>
}
