package br.com.martinlabs.usecase.model

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests Endereco
 * @author martinlabs CRUD generator
 */
class EnderecoTest {


    @Test(expected = RespException::class)
    fun testValidateCepLength46() {
        val endereco = Endereco() 
        endereco.cep = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        endereco.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateZipcodeLength46() {
        val endereco = Endereco() 
        endereco.zipcode = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        endereco.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateRuaLength46() {
        val endereco = Endereco() 
        endereco.rua = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        endereco.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateCidadeLength46() {
        val endereco = Endereco() 
        endereco.cidade = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        endereco.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateUfLength46() {
        val endereco = Endereco() 
        endereco.uf = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        endereco.validate(false, EnglishLanguage())
    } 

    @Test
    fun testValidateSuccess() {
        val endereco = Endereco() 
        
        endereco.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val endereco = Endereco() 
        
        val clone = Endereco(endereco)
        assertEquals(endereco.idEnderecoPk, clone.idEnderecoPk)
        assertEquals(endereco.cep, clone.cep)
        assertEquals(endereco.zipcode, clone.zipcode)
        assertEquals(endereco.rua, clone.rua)
        assertEquals(endereco.nro, clone.nro)
        assertEquals(endereco.cidade, clone.cidade)
        assertEquals(endereco.uf, clone.uf)
        assertEquals(endereco.latitude, clone.latitude)
        assertEquals(endereco.longitude, clone.longitude)
    }
    
}
