package br.com.martinlabs.usecase.model

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests Conectado
 * @author martinlabs CRUD generator
 */
class ConectadoTest {


    @Test(expected = RespException::class)
    fun testValidateTituloLength46() {
        val conectado = Conectado() 
        conectado.titulo = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        conectado.validate(false, EnglishLanguage())
    } 

    @Test
    fun testValidateSuccess() {
        val conectado = Conectado() 
        
        conectado.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val conectado = Conectado() 
        
        val clone = Conectado(conectado)
        assertEquals(conectado.idConectadoPk, clone.idConectadoPk)
        assertEquals(conectado.titulo, clone.titulo)
    }
    
}
