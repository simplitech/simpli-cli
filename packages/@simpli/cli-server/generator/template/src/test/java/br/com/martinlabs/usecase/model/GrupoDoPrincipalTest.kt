package br.com.martinlabs.usecase.model

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests GrupoDoPrincipal
 * @author martinlabs CRUD generator
 */
class GrupoDoPrincipalTest {


    @Test(expected = RespException::class)
    fun testValidateNoTitulo() {
        val grupoDoPrincipal = GrupoDoPrincipal() 
        
        grupoDoPrincipal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateTituloLength46() {
        val grupoDoPrincipal = GrupoDoPrincipal() 
        grupoDoPrincipal.titulo = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        grupoDoPrincipal.validate(false, EnglishLanguage())
    } 

    @Test
    fun testValidateSuccess() {
        val grupoDoPrincipal = GrupoDoPrincipal() 
        grupoDoPrincipal.titulo = "X"
        
        grupoDoPrincipal.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val grupoDoPrincipal = GrupoDoPrincipal() 
        grupoDoPrincipal.titulo = "X"
        
        val clone = GrupoDoPrincipal(grupoDoPrincipal)
        assertEquals(grupoDoPrincipal.idGrupoDoPrincipalPk, clone.idGrupoDoPrincipalPk)
        assertEquals(grupoDoPrincipal.titulo, clone.titulo)
    }
    
}
