package br.com.martinlabs.usecase.model

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests User
 * @author martinlabs CRUD generator
 */
class UserTest {


    @Test(expected = RespException::class)
    fun testValidateNoEmail() {
        val user = User() 
        user.senha = "X"
        
        user.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateEmailLength46() {
        val user = User() 
        user.email = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        user.senha = "X"
        
        user.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateEmailAsInvalidEmail() {
        val user = User() 
        user.email = "notAnEmail"
        user.senha = "X"
        
        user.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateNoSenha() {
        val user = User() 
        user.email = "any@email.com"
        
        user.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateSenhaLength201() {
        val user = User() 
        user.email = "any@email.com"
        user.senha = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        user.validate(false, EnglishLanguage())
    } 

    @Test
    fun testValidateSuccess() {
        val user = User() 
        user.email = "any@email.com"
        user.senha = "X"
        
        user.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val user = User() 
        user.email = "any@email.com"
        user.senha = "X"
        
        val clone = User(user)
        assertEquals(user.idUserPk, clone.idUserPk)
        assertEquals(user.email, clone.email)
        assertEquals(user.senha, clone.senha)
    }
    
}
