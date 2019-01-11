<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.model

import <%-packageAddress%>.dao.<%-table.modelName%>Dao
import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.param.DefaultParam
import <%-packageAddress%>.wrapper.ModelWrapper
import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.getDouble
import br.com.simpli.sql.getDoubleOrNull
import br.com.simpli.sql.getLong
import br.com.simpli.sql.getString
import br.com.simpli.sql.getLongOrNull
import br.com.simpli.sql.getBoolean
import br.com.simpli.sql.getBooleanOrNull
import br.com.simpli.sql.getTimestamp
import br.com.simpli.tools.Validator
import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import io.swagger.annotations.ApiParam
import java.sql.SQLException
import java.sql.ResultSet
import java.util.Date
import javax.ws.rs.PathParam

/**
 * Reference model of table <%-table.name%>
<%_ if (table.commentary) { _%>
 * Note: <%-table.commentary%>
 *
<%_ } _%>
 * @author Simpli CLI generator
 */
<%_ if (table.commentary) { _%>
@ApiModel(description = "<%-table.commentary%>")
<%_ } else { _%>
@ApiModel
<%_ } _%>
class <%-table.modelName%> : ModelWrapper<<%-table.modelName%>Dao> {
    constructor()

<%_ for (var i in table.validRelations) { var relation = table.validRelations[i] _%>
<%_ if (!relation.isManyToMany) { _%>
    var <%-relation.name%>: <%-relation.referencedTableModelName%>? = null
<%_ } else { _%>
    var <%-relation.name%>: MutableList<<%-relation.referencedTableModelName%>>? = null
<%_ } _%>
<%_ } _%>
<%_ if (table.validRelations.length) { _%>

<%_ } _%>
<%_ if (!table.idsColumn.length && !table.hasIDColumnAsFieldName()) { _%>
    var id
        @ApiModelProperty(hidden = true)
        get() = 0
        set(value) {
            // TODO: identify the id property
        }
<%_ } _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
<%_ if (table.idsColumn.length === 1) { _%>
<%_ if (!table.hasIDColumnAsFieldName()) { _%>
    var id
        @ApiModelProperty(hidden = true)
        get() = <%-column.name%>
        set(value) {
            <%-column.name%> = value
        }

<%_ } _%>
<%_ } else { _%>
<%_ if (!table.hasIDColumnAsFieldName(Number(i) + 1)) { _%>
    var id<%-(Number(i) + 1)%>
        @ApiModelProperty(hidden = true)
        get() = <%-column.name%>
        set(value) {
            <%-column.name%> = value
        }

<%_ } _%>
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
        get() = <%-column.foreign.name%>?.<%-column.foreign.referencedColumnName%> ?: <%-column.isString ? '\"\"' : '0'%>
        set(<%-column.name%>) {
            if (<%-column.foreign.name%> === null) {
                <%-column.foreign.name%> = <%-column.foreign.referencedTableModelName%>()
            }
            <%-column.foreign.name%>?.<%-column.foreign.referencedColumnName%> = <%-column.name%>
        }

<%_ } else { _%>
    var <%-column.name%>: <%-column.kotlinType%>?
        get() = <%-column.foreign.name%>?.<%-column.foreign.referencedColumnName%>
        set(<%-column.name%>) {
            if (<%-column.name%> === null) {
                <%-column.foreign.name%> = null
                return
            }
            if (<%-column.foreign.name%> === null) {
                <%-column.foreign.name%> = <%-column.foreign.referencedTableModelName%>()
            }
            <%-column.foreign.name%>?.<%-column.foreign.referencedColumnName%> = <%-column.name%>
        }

<%_ } _%>
<%_ } _%>
    @Throws(BadRequestException::class)
    override fun validate(updating: Boolean, dao: <%-table.modelName%>Dao, lang: LanguageHolder) {
        // TODO: review generated method
        if (updating) {
            if (!dao.exist(<%-table.primariesByParamCall()%>)) {
                throw BadRequestException(lang["does_not_exist"])
            }
        } else {
            if (dao.exist(<%-table.primariesByParamCall()%>)) {
                throw BadRequestException(lang["already_exists"])
            }
        }

<%_ for (var i in table.softDeleteColumns) { var column = table.softDeleteColumns[i] _%>
        <%-column.name%> = true

<%_ } _%>
<%_ for (var i in table.uniqueColumns) { var column = table.uniqueColumns[i] _%>
        if (dao.exist<%-column.capitalizedName%>(<%-column.name%>, <%-table.primariesByParamCall()%>)) {
            throw BadRequestException(lang.alreadyExist("<%-column.name%>"))
        }
<%_ } _%>
<%-table.buildValidate()-%>
    }

    open class ListParam : DefaultParam.AuthPaged()

    open class GetParam : DefaultParam.Auth() {
<%_ if (!table.idsColumn.length) { _%>
        @PathParam("id")
        @ApiParam(required = true)
        var id: Long? = null
<%_ } else if (table.idsColumn.length === 1) { _%>
        @PathParam("id")
        @ApiParam(required = true)
        var id: <%-table.idColumn.kotlinType%>? = null
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        @PathParam("id<%-(Number(i) + 1)%>")
        @ApiParam(required = true)
        var id<%-(Number(i) + 1)%>: <%-column.kotlinType%>? = null
<%_ if (i < table.idsColumn.length - 1) { _%>

<%_ } _%>
<%_ } _%>
<%_ } _%>
    }

    open class PersistParam : DefaultParam.Auth()

<%-table.buildConstructor()-%>
}
