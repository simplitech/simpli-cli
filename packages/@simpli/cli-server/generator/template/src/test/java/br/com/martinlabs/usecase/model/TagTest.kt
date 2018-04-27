package br.com.martinlabs.usecase.model

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests Tag
 * @author martinlabs CRUD generator
 */
class TagTest {


    @Test(expected = RespException::class)
    fun testValidateNoTitulo() {
        val tag = Tag() 
        
        tag.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateTituloLength46() {
        val tag = Tag() 
        tag.titulo = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        tag.validate(false, EnglishLanguage())
    } 

    @Test
    fun testValidateSuccess() {
        val tag = Tag() 
        tag.titulo = "X"
        
        tag.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val tag = Tag() 
        tag.titulo = "X"
        tag.tagPrincipal = ArrayList()
        val principal = Principal()
        principal.idPrincipalPk = 1
        tag.tagPrincipal!!.add(principal)
        
        val clone = Tag(tag)
        assertEquals(tag.idTagPk, clone.idTagPk)
        assertEquals(tag.titulo, clone.titulo)
        assertEquals(tag.tagPrincipal, clone.tagPrincipal)
    }
    
}
