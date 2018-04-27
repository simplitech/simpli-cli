package br.com.martinlabs.usecase.model

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests ExtensaoDoPrincipal
 * @author martinlabs CRUD generator
 */
class ExtensaoDoPrincipalTest {


    @Test(expected = RespException::class)
    fun testValidateNoIdPrincipalFk() {
        val extensaoDoPrincipal = ExtensaoDoPrincipal() 
        extensaoDoPrincipal.titulo = "X"
        
        extensaoDoPrincipal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateNoTitulo() {
        val extensaoDoPrincipal = ExtensaoDoPrincipal() 
        extensaoDoPrincipal.idPrincipalFk = 1
        
        extensaoDoPrincipal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateTituloLength46() {
        val extensaoDoPrincipal = ExtensaoDoPrincipal() 
        extensaoDoPrincipal.idPrincipalFk = 1
        extensaoDoPrincipal.titulo = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        extensaoDoPrincipal.validate(false, EnglishLanguage())
    } 

    @Test
    fun testValidateSuccess() {
        val extensaoDoPrincipal = ExtensaoDoPrincipal() 
        extensaoDoPrincipal.idPrincipalFk = 1
        extensaoDoPrincipal.titulo = "X"
        
        extensaoDoPrincipal.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val extensaoDoPrincipal = ExtensaoDoPrincipal() 
        extensaoDoPrincipal.principal = Principal()
        extensaoDoPrincipal.idPrincipalFk = 1
        extensaoDoPrincipal.titulo = "X"
        
        val clone = ExtensaoDoPrincipal(extensaoDoPrincipal)
        assertEquals(extensaoDoPrincipal.idPrincipalFk, clone.idPrincipalFk)
        assertEquals(extensaoDoPrincipal.principal, clone.principal)
        assertEquals(extensaoDoPrincipal.titulo, clone.titulo)
    }
    
}
