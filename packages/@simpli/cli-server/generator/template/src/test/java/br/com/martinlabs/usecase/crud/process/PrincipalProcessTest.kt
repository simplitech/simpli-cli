package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.Principal
import br.com.martinlabs.usecase.model.Tag
import br.com.martinlabs.usecase.crud.response.PrincipalResp
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
 * Tests Principal business logic
 * @author martinlabs CRUD generator
 */
class PrincipalProcessTest @Throws(NamingException::class, SQLException::class)
constructor() : DaoTest("jdbc/usecaseDS", "usecase") {

    private val con: Connection
    private val loginS: LoginServices
    private val subject: PrincipalProcess

    init {
        con = getConnection()
        val lang = EnglishLanguage()
        val clientVersion = "w1.0.0"
        subject = PrincipalProcess(con, lang, clientVersion)
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
        val query = "lorem"
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
        assertNotNull(result.principal)
        assertFalse(result.allGrupoDoPrincipal!!.isEmpty())
        assertNotNull(result.allGrupoDoPrincipal!![0])
        assertFalse(result.allTag!!.isEmpty())
        assertNotNull(result.allTag!![0])

    }

    @Test(expected = RespException::class)
    fun testPersistWithRepeatedUnico() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.dataCriacao = Date()
        principal.unico = "lorem"
        
        subject.persist(principal, token)
    }

    @Test
    fun testPersist() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        val result = subject.persist(principal, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

    @Test
    fun testPersistWithTagPrincipal() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        principal.tagPrincipal = ArrayList()
        val tag = Tag()
        tag.idTagPk = 1
        principal.tagPrincipal!!.add(tag)
        
        val result = subject.persist(principal, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

    @Test
    fun testPersistUpdating() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val principal = Principal() 
        principal.idPrincipalPk = 1
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        val result = subject.persist(principal, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

    @Test
    fun testRemove() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        
        subject.remove(1L, token)
    }

}
