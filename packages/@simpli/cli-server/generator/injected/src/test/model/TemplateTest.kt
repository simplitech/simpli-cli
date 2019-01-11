<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.model

import <%-packageAddress%>.AppTest
import <%-packageAddress%>.dao.<%-table.modelName%>Dao
import <%-packageAddress%>.exception.response.BadRequestException
import java.util.Date
import org.apache.commons.lang3.RandomStringUtils
import org.junit.Test
import kotlin.test.assertNotNull
import kotlin.test.assertNull

/**
 * Tests <%-table.modelName%>
 * @author Simpli CLI generator
 */
class <%-table.modelName%>Test: AppTest() {
    private val model = <%-table.modelName%>()
    private val dao = <%-table.modelName%>Dao(con, lang)

    init {
<%_ for (var i in table.requiredColumns) { var column = table.requiredColumns[i] _%>
        model.<%-column.name%> = <%-column.testValue%>
<%_ } _%>
    }

<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (column.isRequired && !column.isBoolean && !column.isDouble && !column.isID) { _%>
    @Test(expected = BadRequestException::class)
    fun testValidate<%-column.capitalizedName%>NullFail() {
<%_ if (!column.isRequired) { _%>
        model.<%-column.name%> = null
<%_ } else if (column.isLong) { _%>
        model.<%-column.name%> = 0L
<%_ } else if (column.isDouble) { _%>
        model.<%-column.name%> = 0
<%_ } else if (column.isBoolean) { _%>
        model.<%-column.name%> = false
<%_ } else if (column.qMark === '?') { _%>
        model.<%-column.name%> = null
<%_ } _%>

        model.validate(true, dao, lang)
    }

<%_ } _%>
<%_ if (column.isString && column.size) { _%>
    @Test(expected = BadRequestException::class)
    fun testValidate<%-column.capitalizedName%>LengthFail() {
        model.<%-column.name%> = RandomStringUtils.randomAlphabetic(<%-Number(column.size) + 1%>)

        model.validate(true, dao, lang)
    }

<%_ } _%>
<%_ if (column.isEmail) { _%>
    @Test(expected = BadRequestException::class)
    fun testValidate<%-column.capitalizedName%>InvalidEmailFail() {
        model.<%-column.name%> = "notAnEmail"

        model.validate(true, dao, lang)
    }

<%_ } _%>
<%_ if (column.isForeign && !column.isRequired) { _%>
    @Test
    fun testSet<%-column.foreign.capitalizedName%>Null() {
        model.<%-column.foreign.name%> = <%-column.foreign.referencedTableModelName%>()
        model.<%-column.name%> = null
        assertNull(model.<%-column.foreign.name%>)
        model.<%-column.name%> = <%-column.isString ? '\"1\"' : '1L'%>
        assertNotNull(model.<%-column.foreign.name%>)
    }

<%_ } _%>
<%_ } _%>
    @Test
    fun testValidateSuccess() {
        model.validate(true, dao, lang)
    }
}
