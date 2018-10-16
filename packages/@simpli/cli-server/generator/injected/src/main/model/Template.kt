<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.model

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import java.sql.SQLException
import java.util.Date
import br.com.simpli.model.LanguageHolder
import br.com.simpli.model.RespException
import br.com.simpli.sql.*
import java.sql.ResultSet
import br.com.simpli.tools.Validator
import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * Reference model of table <%-table.name%>
<%_ if (table.commentary) { _%>
 * Note: <%-table.commentary%>
 *
<%_ } _%>
 * @author Simpli© CLI generator
 */
<%_ if (table.commentary) { _%>
@ApiModel(description = "<%-table.commentary%>")
<%_ } else { _%>
@ApiModel
<%_ } _%>
class <%-table.modelName%> {
<%_ for (var i in table.validRelations) { var relation = table.validRelations[i] _%>
<%_ if (!relation.isManyToMany) { _%>
    var <%-relation.name%>: <%-relation.referencedTableModelName%>? = null
<%_ } else { _%>
    var <%-relation.name%>: MutableList<<%-relation.referencedTableModelName%>>? = null
<%_ } _%>
<%_ } _%>

<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (!column.isForeign) { _%>
<%_ if (column.isRequired) { _%>
<%_ if (column.commentary) { _%>
    @ApiModelProperty(required = true, value = "<%-column.commentary%>")
<%_ } else { _%>
    @ApiModelProperty(required = true)
<%_ } _%>
<%_ } else if (column.commentary) { _%>
    @ApiModelProperty(value = "<%-column.commentary%>")
<%_ } _%>
    var <%-column.name%>: <%-column.kotlinType%><%-column.qMark%> = <%-column.defaultValue%>

<%_ } else if (column.isRequired) {_%>
    var <%-column.name%>: <%-column.kotlinType%>
        get() = <%-column.foreign.name%>?.<%-column.foreign.referencedColumnName%> ?: 0
        set(<%-column.name%>) {
            if (<%-column.foreign.name%> == null) {
                <%-column.foreign.name%> = <%-column.foreign.referencedTableModelName%>()
            }
            <%-column.foreign.name%>?.<%-column.foreign.referencedColumnName%> = <%-column.name%>
        }

<%_ } else { _%>
    var <%-column.name%>: <%-column.kotlinType%>?
        get() = if (<%-column.foreign.name%> == null || <%-column.foreign.name%>?.<%-column.foreign.referencedColumnName%> == 0L) null else <%-column.foreign.name%>?.<%-column.foreign.referencedColumnName%>
        set(<%-column.name%>) {
            if (<%-column.name%> == null) {
                <%-column.foreign.name%> = null
                return
            }
            if (<%-column.foreign.name%> == null) {
                <%-column.foreign.name%> = <%-column.foreign.referencedTableModelName%>()
            }
            <%-column.foreign.name%>?.<%-column.foreign.referencedColumnName%> = <%-column.name%>
        }

<%_ } _%>
<%_ } _%>
    constructor() {}

    fun validate(updating: Boolean, lang: LanguageHolder) {
        if (updating) {
            //TODO: Specify updating validation
        }

<%-table.buildValidate()-%>
    }

    companion object {
<%-table.buildBuildAll()-%>
    }
}
