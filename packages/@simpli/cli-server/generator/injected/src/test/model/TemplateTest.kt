<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.model

import <%-packageAddress%>.exception.HttpException
import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests <%-table.modelName%>
 * @author Simpli© CLI generator
 */
class <%-table.modelName%>Test {

<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (column.isRequired && !column.isBoolean && !column.isDouble && !column.isID) { _%>
    @Test(expected = HttpException::class)
    fun testValidateIn<%-column.capitalizedName%>() {
        val <%-table.instanceName%> = <%-table.modelName%>()
<%_ for (var i in table.requiredColumns) { var col = table.requiredColumns[i] _%>
<%_ if (column.name !== col.name && !col.isID) { _%>
        <%-table.instanceName%>.<%-col.name%> = <%-col.testValue%>
<%_ } _%>
<%_ } _%>

        <%-table.instanceName%>.validate(false, EnglishLanguage())
    }

<%_ } _%>
<%_ if (column.isString && column.size) { _%>
    @Test(expected = HttpException::class)
    fun testValidate<%-column.capitalizedName%>Length<%-column.size%>() {
        val <%-table.instanceName%> = <%-table.modelName%>()
<%_ for (var i in table.requiredColumns) { var col = table.requiredColumns[i] _%>
<%_ if (column.name !== col.name && !col.isID) { _%>
        <%-table.instanceName%>.<%-col.name%> = <%-col.testValue%>
<%_ } _%>
<%_ } _%>

        <%-table.instanceName%>.<%-column.name%> = "<%-options.serverSetup.randomString(column.size + 1, 'a')%>"

        <%-table.instanceName%>.validate(false, EnglishLanguage())
    }

<%_ } _%>
<%_ if (column.isEmail) { _%>
    @Test(expected = HttpException::class)
    fun testValidate<%-column.capitalizedName%>AsInvalidEmail() {
        val <%-table.instanceName%> = <%-table.modelName%>()
<%_ for (var i in table.requiredColumns) { var col = table.requiredColumns[i] _%>
<%_ if (column.name !== col.name && !col.isID) { _%>
        <%-table.instanceName%>.<%-col.name%> = <%-col.testValue%>
<%_ } _%>
<%_ } _%>

        <%-table.instanceName%>.<%-column.name%> = "notAnEmail"

        <%-table.instanceName%>.validate(false, EnglishLanguage())
    }

<%_ } _%>
<%_ if (column.isForeign && !column.isRequired) { _%>
    @Test
    fun testSet<%-column.foreign.capitalizedName%>Null() {
        val <%-table.instanceName%> = <%-table.modelName%>()
        <%-table.instanceName%>.<%-column.foreign.name%> = <%-column.foreign.referencedTableModelName%>()
        <%-table.instanceName%>.<%-column.name%> = null
        assertNull(<%-table.instanceName%>.<%-column.foreign.name%>)
        <%-table.instanceName%>.<%-column.name%> = 1L
        assertNotNull(<%-table.instanceName%>.<%-column.foreign.name%>)
    }

<%_ } _%>
<%_ } _%>
    @Test
    fun testValidateSuccess() {
        val <%-table.instanceName%> = <%-table.modelName%>()
<%_ for (var i in table.requiredColumns) { var column = table.requiredColumns[i] _%>
        <%-table.instanceName%>.<%-column.name%> = <%-column.testValue%>
<%_ } _%>

        <%-table.instanceName%>.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val <%-table.instanceName%> = <%-table.modelName%>()

<%_ for (var i in table.validRelations) { var relation = table.validRelations[i] _%>
<%_ if (!relation.isManyToMany) { _%>
        <%-table.instanceName%>.<%-relation.name%> = <%-relation.referencedTableModelName%>()
<%_ } else { _%>
        <%-table.instanceName%>.<%-relation.name%> = ArrayList()
<%_ var m2m = table.findManyToManyByPivotTableName(relation.tableName) _%>
<%_ if (m2m) { _%>
        val <%-m2m.crossRelationInstanceName%> = <%-m2m.crossRelationModelName%>()
        <%-m2m.crossRelationInstanceName%>.<%-m2m.crossRelationColumnName%> = 1
        <%-table.instanceName%>.<%-relation.name%>!!.add(<%-m2m.crossRelationInstanceName%>)
<%_ } _%>
<%_ } _%>
<%_ } _%>
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
        <%-table.instanceName%>.<%-column.name%> = <%-column.testValue%>
<%_ } _%>

        val clone = <%-table.ModelName%>(<%-table.instanceName%>)
<%_ for (var i in table.validRelations) { var relation = table.validRelations[i] _%>
        assertEquals(<%-table.instanceName%>.<%-relation.name%>, clone.<%-relation.name%>)
<%_ } _%>
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (column.isDouble && column.isRequired) { _%>
        assertEquals(<%-table.instanceName%>.<%-column.name%>, clone.<%-column.name%>, 0.0)
<%_ } else { _%>
        assertEquals(<%-table.instanceName%>.<%-column.name%>, clone.<%-column.name%>)
<%_ } _%>
<%_ } _%>
    }
}
