package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.Tag
import br.com.martinlabs.usecase.model.Principal
import br.com.martinlabs.usecase.crud.response.TagResp
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
 * Tests Tag business logic
 * @author martinlabs CRUD generator
 */
class TagProcessTest @Throws(NamingException::class, SQLException::class)
constructor() : DaoTest("jdbc/usecaseDS", "usecase") {

    private val con: Connection
    private val loginS: LoginServices
    private val subject: TagProcess

    init {
        con = getConnection()
        val lang = EnglishLanguage()
        val clientVersion = "w1.0.0"
        subject = TagProcess(con, lang, clientVersion)
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
        assertNotNull(result.tag)
        assertFalse(result.allPrincipal!!.isEmpty())
        assertNotNull(result.allPrincipal!![0])

    }

    @Test
    fun testPersist() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val tag = Tag() 
        tag.titulo = "X"
        
        val result = subject.persist(tag, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

    @Test
    fun testPersistWithTagPrincipal() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val tag = Tag() 
        tag.titulo = "X"
        tag.tagPrincipal = ArrayList()
        val principal = Principal()
        principal.idPrincipalPk = 1
        tag.tagPrincipal!!.add(principal)
        
        val result = subject.persist(tag, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

    @Test
    fun testPersistUpdating() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val tag = Tag() 
        tag.idTagPk = 1
        tag.titulo = "X"
        
        val result = subject.persist(tag, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

}
