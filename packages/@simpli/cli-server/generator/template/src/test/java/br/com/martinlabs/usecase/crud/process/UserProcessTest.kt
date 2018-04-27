package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.User
import br.com.martinlabs.usecase.crud.response.UserResp
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
 * Tests User business logic
 * @author martinlabs CRUD generator
 */
class UserProcessTest @Throws(NamingException::class, SQLException::class)
constructor() : DaoTest("jdbc/usecaseDS", "usecase") {

    private val con: Connection
    private val loginS: LoginServices
    private val subject: UserProcess

    init {
        con = getConnection()
        val lang = EnglishLanguage()
        val clientVersion = "w1.0.0"
        subject = UserProcess(con, lang, clientVersion)
        loginS = LoginServices(con, lang, clientVersion)
    }

    @Test
    fun testListNoQuery() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
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
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
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
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))

        val result = subject.getOne(1L, token)
        assertNotNull(result)
        assertNotNull(result.user)
    }

    @Test
    fun testPersist() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val user = User() 
        user.email = "any@email.com"
        user.senha = "X"
        
        val result = subject.persist(user, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

    @Test
    fun testPersistUpdating() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val user = User() 
        user.idUserPk = 1
        user.email = "any@email.com"
        user.senha = "X"
        
        val result = subject.persist(user, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

}
