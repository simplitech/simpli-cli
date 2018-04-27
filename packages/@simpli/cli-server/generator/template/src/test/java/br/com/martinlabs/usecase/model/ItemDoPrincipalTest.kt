package br.com.martinlabs.usecase.model

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests ItemDoPrincipal
 * @author martinlabs CRUD generator
 */
class ItemDoPrincipalTest {


    @Test(expected = RespException::class)
    fun testValidateNoIdPrincipalFk() {
        val itemDoPrincipal = ItemDoPrincipal() 
        itemDoPrincipal.titulo = "X"
        
        itemDoPrincipal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateNoTitulo() {
        val itemDoPrincipal = ItemDoPrincipal() 
        itemDoPrincipal.idPrincipalFk = 1
        
        itemDoPrincipal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateTituloLength46() {
        val itemDoPrincipal = ItemDoPrincipal() 
        itemDoPrincipal.idPrincipalFk = 1
        itemDoPrincipal.titulo = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        itemDoPrincipal.validate(false, EnglishLanguage())
    } 

    @Test
    fun testValidateSuccess() {
        val itemDoPrincipal = ItemDoPrincipal() 
        itemDoPrincipal.idPrincipalFk = 1
        itemDoPrincipal.titulo = "X"
        
        itemDoPrincipal.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val itemDoPrincipal = ItemDoPrincipal() 
        itemDoPrincipal.principal = Principal()
        itemDoPrincipal.idPrincipalFk = 1
        itemDoPrincipal.titulo = "X"
        
        val clone = ItemDoPrincipal(itemDoPrincipal)
        assertEquals(itemDoPrincipal.idPrincipalFk, clone.idPrincipalFk)
        assertEquals(itemDoPrincipal.principal, clone.principal)
        assertEquals(itemDoPrincipal.idItemDoPrincipalPk, clone.idItemDoPrincipalPk)
        assertEquals(itemDoPrincipal.titulo, clone.titulo)
    }
    
}
