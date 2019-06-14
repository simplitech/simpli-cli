<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var database = options.serverSetup.connection.database _%>
package <%-packageAddress%>.<%-moduleName%>.process

import <%-packageAddress%>.<%-moduleName%>.ProcessTest
import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.exception.response.NotFoundException
import <%-packageAddress%>.model.resource.<%-table.modelName%>
<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>
<%_ if (m2m.crossRelationModelName !== table.modelName) { _%>
import <%-packageAddress%>.model.resource.<%-m2m.crossRelationModelName%>
<%_ } _%>
<%_ } _%>
import java.util.Date
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import kotlin.test.assertNotEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNotSame
import org.junit.Ignore
import org.junit.Test

/**
 * Tests <%-table.modelName%> business logic
 * @author Simpli CLI generator
 */
class <%-table.modelName%>ProcessTest : ProcessTest() {
<%_ if (table.idsColumn.length <= 1) { _%>
    private val id = <%-table.idColumn.isString ? '\"1\"' : '1L'%>
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
    private val id<%-(Number(i) + 1)%> = <%-table.idColumn.isString ? '\"1\"' : '1L'%>
<%_ } _%>
<%_ } _%>
    private val model = <%-table.modelName%>()

    private object Request {
        val get = <%-table.modelName%>.GetParam()
        val list = <%-table.modelName%>.ListParam()
    }

    private val subject = <%-table.modelName%>Process()

    init {
        subject.assign(con, lang, clientVersion)

<%_ for (var i in table.requiredColumns) { var column = table.requiredColumns[i] _%>
        model.<%-column.name%> = <%-column.testValue%>
<%_ } _%>
<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>

        val <%-m2m.crossRelationInstanceName%> = <%-m2m.crossRelationModelName%>()
        <%-m2m.crossRelationInstanceName%>.id = 1L
        model.<%-m2m.pivotInstanceName%> = mutableListOf(<%-m2m.crossRelationInstanceName%>)
<%_ } _%>
    }

    @Test
    fun testList() {
        val result = subject.list(Request.list)
        assertFalse(result.items.isEmpty())
        assertNotEquals(0, result.total)
    }

    @Test
    fun testListPaginated() {
        Request.list.page = 0
        Request.list.limit = 1

        val result = subject.list(Request.list)
        assertFalse(result.items.isEmpty())
        assertNotEquals(0, result.total)
        assertTrue(result.items.size <= Request.list.limit ?: 0)
    }

    @Test
    fun testGetSuccess() {
<%_ if (table.idsColumn.length <= 1) { _%>
        Request.get.id = id
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        Request.get.id<%-(Number(i) + 1)%> = id<%-(Number(i) + 1)%>
<%_ } _%>
<%_ } _%>

        val result = subject.get(Request.get)
<%_ if (table.idsColumn.length <= 1) { _%>
        assertNotSame(<%-table.idColumn.isString ? '\"0\"' : '0'%>, result.id)
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        assertNotSame(<%-table.idColumn.isString ? '\"0\"' : '0'%>, result.id<%-(Number(i) + 1)%>)
<%_ } _%>
<%_ } _%>
<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>
        assertNotNull(result.<%-m2m.pivotInstanceName%>)
<%_ } _%>
    }

    @Test(expected = NotFoundException::class)
    fun testGetFail() {
<%_ if (table.idsColumn.length <= 1) { _%>
        Request.get.id = <%-table.idColumn.isString ? '\"0\"' : '0'%>
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        Request.get.id<%-(Number(i) + 1)%> = <%-table.idColumn.isString ? '\"0\"' : '0'%>
<%_ } _%>
<%_ } _%>

        subject.get(Request.get)
    }
<%_ if (table.hasPersist) { _%>

    @Test
<%_ if (table.idsColumn.length === 1 && !table.idColumn.isAutoIncrement) { _%>
    @Ignore
<%_ } _%>
    fun testCreateSuccess() {
<%_ if (table.idsColumn.length <= 1) { _%>
        model.id = <%-table.idColumn.isString ? '\"0\"' : '0'%>
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        model.id<%-(Number(i) + 1)%> = <%-table.idColumn.isString ? '\"' + (Number(i) + 1) + '\"' : '' + (Number(i) + 1)%>
<%_ } _%>
<%_ } _%>

        val result = subject.create(model)
        assertTrue(result > <%-table.idColumn.isString ? '\"0\"' : '0'%>)
    }

    @Test(expected = BadRequestException::class)
    fun testCreateFail() {
<%_ if (table.idsColumn.length <= 1) { _%>
        model.id = id
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        model.id<%-(Number(i) + 1)%> = id<%-(Number(i) + 1)%>
<%_ } _%>
<%_ } _%>

        subject.create(model)
    }

    @Test
    fun testUpdateSuccess() {
<%_ if (table.idsColumn.length <= 1) { _%>
        model.id = id
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        model.id<%-(Number(i) + 1)%> = id<%-(Number(i) + 1)%>
<%_ } _%>
<%_ } _%>

        val result = subject.update(model)
        assertTrue(result > <%-table.idColumn.isString ? '\"0\"' : '0'%>)
    }

    @Test(expected = BadRequestException::class)
    fun testUpdateFail() {
<%_ if (table.idsColumn.length <= 1) { _%>
        model.id = <%-table.idColumn.isString ? '\"0\"' : '0'%>
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        model.id<%-(Number(i) + 1)%> = <%-table.idColumn.isString ? '\"0\"' : '0'%>
<%_ } _%>
<%_ } _%>

        subject.update(model)
    }
<%_ } _%>
<%_ if (table.isRemovable) { _%>

    @Test
    fun testRemoveSuccess() {
<%_ if (table.idsColumn.length <= 1) { _%>
        Request.get.id = id
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        Request.get.id<%-(Number(i) + 1)%> = id<%-(Number(i) + 1)%>
<%_ } _%>
<%_ } _%>

        subject.remove(Request.get)
    }

    @Test(expected = NotFoundException::class)
    fun testRemoveFail() {
<%_ if (table.idsColumn.length <= 1) { _%>
        Request.get.id = <%-table.idColumn.isString ? '\"0\"' : '0'%>
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        Request.get.id<%-(Number(i) + 1)%> = <%-table.idColumn.isString ? '\"0\"' : '0'%>
<%_ } _%>
<%_ } _%>

        subject.remove(Request.get)
    }
<%_ } _%>
}
