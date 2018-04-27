package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.ConectorPrincipal
import br.com.martinlabs.usecase.crud.response.ConectorPrincipalResp
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
 * Tests ConectorPrincipal business logic
 * @author martinlabs CRUD generator
 */
class ConectorPrincipalProcessTest @Throws(NamingException::class, SQLException::class)
constructor() : DaoTest("jdbc/usecaseDS", "usecase") {

    private val con: Connection
    private val loginS: LoginServices
    private val subject: ConectorPrincipalProcess

    init {
        con = getConnection()
        val lang = EnglishLanguage()
        val clientVersion = "w1.0.0"
        subject = ConectorPrincipalProcess(con, lang, clientVersion)
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

        val result = subject.getOne(1L, 1L, token)
        assertNotNull(result)
        assertNotNull(result.conectorPrincipal)
        assertFalse(result.allConectado!!.isEmpty())
        assertNotNull(result.allConectado!![0])
        assertFalse(result.allPrincipal!!.isEmpty())
        assertNotNull(result.allPrincipal!![0])
    }

    @Test
    fun testPersist() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val conectorPrincipal = ConectorPrincipal() 
        conectorPrincipal.idConectadoFk = 1
        conectorPrincipal.idPrincipalFk = 1
        conectorPrincipal.titulo = "X"
        
        val result = subject.persist(conectorPrincipal, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

    @Test
    fun testPersistInserting() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val conectorPrincipal = ConectorPrincipal()

        val idPrincipalFk = Dao.updateForTest(con, """
            INSERT INTO principal ( 
            idGrupoDoPrincipalFk
            ,textoObrigatorio
            ,decimalObrigatorio
            ,inteiroObrigatorio
            ,booleanoObrigatorio
            ,dataObrigatoria
            ,datahoraObrigatoria
            ,ativo
            ,unico
            ,dataCriacao
            ) VALUES (
            ?,?,?,?,?,?,?,?,?,?
            )
            """,
            1,
            "X",
            1,
            1,
            1,
            Date(),
            Date(),
            1,
            "X",
            Date()).key
         
        conectorPrincipal.idPrincipalFk = idPrincipalFk

        val idConectadoFk = Dao.updateForTest(con, """
            INSERT INTO conectado ( 
            titulo
            ) VALUES (
            ?
            )
            """,
            "X").key
         
        conectorPrincipal.idConectadoFk = idConectadoFk

        conectorPrincipal.titulo = "X"
        
        val result = subject.persist(conectorPrincipal, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }

}
