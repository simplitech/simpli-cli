package br.com.martinlabs.usecase.model

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests ConectorPrincipal
 * @author martinlabs CRUD generator
 */
class ConectorPrincipalTest {


    @Test(expected = RespException::class)
    fun testValidateNoIdConectadoFk() {
        val conectorPrincipal = ConectorPrincipal() 
        conectorPrincipal.idPrincipalFk = 1
        conectorPrincipal.titulo = "X"
        
        conectorPrincipal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateNoIdPrincipalFk() {
        val conectorPrincipal = ConectorPrincipal() 
        conectorPrincipal.idConectadoFk = 1
        conectorPrincipal.titulo = "X"
        
        conectorPrincipal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateNoTitulo() {
        val conectorPrincipal = ConectorPrincipal() 
        conectorPrincipal.idConectadoFk = 1
        conectorPrincipal.idPrincipalFk = 1
        
        conectorPrincipal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateTituloLength46() {
        val conectorPrincipal = ConectorPrincipal() 
        conectorPrincipal.idConectadoFk = 1
        conectorPrincipal.idPrincipalFk = 1
        conectorPrincipal.titulo = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        conectorPrincipal.validate(false, EnglishLanguage())
    } 

    @Test
    fun testValidateSuccess() {
        val conectorPrincipal = ConectorPrincipal() 
        conectorPrincipal.idConectadoFk = 1
        conectorPrincipal.idPrincipalFk = 1
        conectorPrincipal.titulo = "X"
        
        conectorPrincipal.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val conectorPrincipal = ConectorPrincipal() 
        conectorPrincipal.conectado = Conectado()
        conectorPrincipal.idConectadoFk = 1
        conectorPrincipal.principal = Principal()
        conectorPrincipal.idPrincipalFk = 1
        conectorPrincipal.titulo = "X"
        
        val clone = ConectorPrincipal(conectorPrincipal)
        assertEquals(conectorPrincipal.idConectadoFk, clone.idConectadoFk)
        assertEquals(conectorPrincipal.conectado, clone.conectado)
        assertEquals(conectorPrincipal.idPrincipalFk, clone.idPrincipalFk)
        assertEquals(conectorPrincipal.principal, clone.principal)
        assertEquals(conectorPrincipal.titulo, clone.titulo)
    }
    
}
