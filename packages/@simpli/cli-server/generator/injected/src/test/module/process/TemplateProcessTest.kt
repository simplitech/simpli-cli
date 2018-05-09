<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var database = options.serverSetup.connection.database _%>
package <%-packageAddress%>.<%-moduleName%>.process

import <%-packageAddress%>.model.<%-table.modelName%>
import <%-packageAddress%>.<%-moduleName%>.response.<%-table.modelName%>Resp
<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>
import <%-packageAddress%>.model.<%-m2m.crossRelationModelName%>
<%_ } _%>
import <%-packageAddress%>.exception.HttpException
import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import com.simpli.sql.Dao
import com.simpli.sql.DaoTest
import com.simpli.tools.SecurityUtils
import java.sql.Connection
import java.sql.SQLException
import javax.naming.NamingException
import java.util.ArrayList
import java.util.Date
import org.junit.Assert.*
import org.junit.Test
import org.junit.Before

/**
 * Tests <%-table.modelName%> business logic
 * @author Simpli© CLI generator
 */
class <%-table.modelName%>ProcessTest @Throws(NamingException::class, SQLException::class)
constructor() : DaoTest("jdbc/<%-database%>DS", "<%-database%>") {

    private val con: Connection
    private val loginS: LoginService
    private val subject: <%-table.modelName%>Process

    init {
        con = getConnection()
        val lang = EnglishLanguage()
        val clientVersion = "w1.0.0"
        subject = <%-table.modelName%>Process(con, lang, clientVersion)
        loginS = LoginService(con, lang, clientVersion)
    }

    @Test
    fun testListNoQuery() {
        val token = loginS.loginToToken("test@test.com", SecurityUtils.sha256("tester"))
        val query: String? = null
        val page = 0
        val limit = 20
        val orderRequest: String? = null
        val asc: Boolean? = null
                
        val result = subject.list(token, query, page, limit, orderRequest, asc)
        assertNotNull(result)
        assertNotNull(result.list)
        assertNotEquals(result.recordsTotal.toLong(), 0)
        assertFalse(result.list.isEmpty())
        assertNotNull(result.list[0])
    }

    @Test
    fun testListWithQuery() {
        val token = loginS.loginToToken("test@test.com", SecurityUtils.sha256("tester"))
        val query: String? = "1"
        val page = 0
        val limit = 20
        val orderRequest: String? = null
        val asc: Boolean? = null
                
        val result = subject.list(token, query, page, limit, orderRequest, asc)
        assertNotNull(result)
        assertNotNull(result.list)
        assertNotEquals(result.recordsTotal.toLong(), 0)
        assertFalse(result.list.isEmpty())
        assertNotNull(result.list[0])
    }

    @Test
    fun testGetOne() {
        val token = loginS.loginToToken("test@test.com", SecurityUtils.sha256("tester"))

        val result = subject.getOne(<%-table.primariesTestValuesByParam()%>, token)
        assertNotNull(result)
        assertNotNull(result.<%-table.instanceName%>)
<%_ for (var i in table.validDistinctRelations) { var relation = table.validDistinctRelations[i] _%>
        assertFalse(result.all<%-relation.referencedTableModelName%>!!.isEmpty())
        assertNotNull(result.all<%-relation.referencedTableModelName%>!![0])
<%_ } _%>
    }
<%_ if (table.hasUnique) { _%>

<%_ for (var i in table.uniqueColumns) { var column = table.uniqueColumns[i] _%>
    @Test(expected = HttpException::class)
    fun testPersistWithRepeated<%-column.capitalizedName%>() {
        val token = loginS.loginToToken("test@test.com", SecurityUtils.sha256("tester"))
        val <%-table.instanceName%> = <%-table.modelName%>()
<%_ for (var i in table.requiredColumns) { var col = table.requiredColumns[i] _%>
<%_ if (column.name !== col.name && !col.isID) { _%>
        <%-table.instanceName%>.<%-col.name%> = <%-col.testValue%>
<%_ } _%>
<%_ } _%>

        <%-table.instanceName%>.<%-column.name%> = "lorem"

        subject.persist(<%-table.instanceName%>, token)
    }
<%_ } _%>
<%_ } _%>
<%_ if (table.hasPersist) { _%>

    @Test
    fun testPersist() {
        val token = loginS.loginToToken("test@test.com", SecurityUtils.sha256("tester"))
        val <%-table.instanceName%> = <%-table.modelName%>()
<%_ for (var i in table.requiredColumns) { var column = table.requiredColumns[i] _%>
        <%-table.instanceName%>.<%-column.name%> = <%-column.testValue%>
<%_ } _%>

        val result = subject.persist(<%-table.instanceName%>, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }
<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>

    @Test
    fun testPersistWith<%-m2m.pivotModelName%>() {
        val token = loginS.loginToToken("test@test.com", SecurityUtils.sha256("tester"))
        val <%-table.instanceName%> = <%-table.modelName%>()
<%_ for (var i in table.requiredColumns) { var column = table.requiredColumns[i] _%>
        <%-table.instanceName%>.<%-column.name%> = <%-column.testValue%>
<%_ } _%>
        <%-table.instanceName%>.<%-m2m.pivotInstanceName%> = ArrayList()
        val <%-m2m.crossRelationInstanceName%> = <%-m2m.crossRelationModelName%>()
        <%-m2m.crossRelationInstanceName%>.<%-m2m.crossRelationColumnName%> = 1
        <%-table.instanceName%>.<%-m2m.pivotInstanceName%>!!.add(<%-m2m.crossRelationInstanceName%>)
        
        val result = subject.persist(<%-table.instanceName%>, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }
<%_ } _%>

    @Test
    fun testPersistUpdating() {
        val token = loginS.loginToToken("test@test.com", SecurityUtils.sha256("tester"))
        val <%-table.instanceName%> = <%-table.modelName%>()
<%_ for (var i in table.requiredColumns) { var column = table.requiredColumns[i] _%>
        <%-table.instanceName%>.<%-column.name%> = <%-column.testValue%>
<%_ } _%>

        val result = subject.persist(<%-table.instanceName%>, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }
<%_ } _%>
<%_ if (table.isRemovable) { _%>

    @Test
    fun testRemove() {
        val token = loginS.loginToToken("test@test.com", SecurityUtils.sha256("tester"))
        
        subject.remove(1L, token)
    }
<%_ } _%>
}
