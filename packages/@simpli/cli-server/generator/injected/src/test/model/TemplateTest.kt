package br.com.martinlabs.usecase.model

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests Principal
 * @author martinlabs CRUD generator
 */
class PrincipalTest {


    @Test(expected = RespException::class)
    fun testValidateNoIdGrupoDoPrincipalFk() {
        val principal = Principal() 
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 

    @Test
    fun testSetIdGrupoDoPrincipalFacultativoFkNull() {
        val principal = Principal()
        principal.grupoDoPrincipalFacultativo = GrupoDoPrincipal()
        principal.idGrupoDoPrincipalFacultativoFk = null
        assertNull(principal.grupoDoPrincipalFacultativo)
        principal.idGrupoDoPrincipalFacultativoFk = 1L
        assertNotNull(principal.grupoDoPrincipalFacultativo)
    }

    @Test(expected = RespException::class)
    fun testValidateNoTextoObrigatorio() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateTextoObrigatorioLength161() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateTextoFacultativoLength46() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.textoFacultativo = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateNoDataObrigatoria() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateNoDatahoraObrigatoria() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateEmailLength201() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.email = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateEmailAsInvalidEmail() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.email = "notAnEmail"
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateSenhaLength201() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.senha = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateUrlImagemLength201() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.urlImagem = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateUrlLength201() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.url = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateNoUnico() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 

    @Test(expected = RespException::class)
    fun testValidateUnicoLength41() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateNomeLength46() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        principal.nome = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateTituloLength46() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        principal.titulo = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateCpfLength46() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        principal.cpf = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateCnpjLength46() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        principal.cnpj = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateRgLength46() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        principal.rg = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateCelularLength46() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        principal.celular = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        principal.validate(false, EnglishLanguage())
    } 
    @Test(expected = RespException::class)
    fun testValidateTextoGrandeLength301() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        principal.textoGrande = "Heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
        
        principal.validate(false, EnglishLanguage())
    } 

    @Test
    fun testValidateSuccess() {
        val principal = Principal() 
        principal.idGrupoDoPrincipalFk = 1
        principal.textoObrigatorio = "X"
        principal.decimalObrigatorio = 1.0
        principal.inteiroObrigatorio = 1
        principal.dataObrigatoria = Date()
        principal.datahoraObrigatoria = Date()
        principal.unico = "X"
        principal.dataCriacao = Date()
        
        principal.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val principal = Principal() 
        principal.grupoDoPrincipal = GrupoDoPrincipal()
        principal.idGrupoDoPrincipalFk = 1
        principal.grupoDoPrincipalFacultativo = GrupoDoPrincipal()
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
        
        val clone = Principal(principal)
        assertEquals(principal.idGrupoDoPrincipalFk, clone.idGrupoDoPrincipalFk)
        assertEquals(principal.grupoDoPrincipal, clone.grupoDoPrincipal)
        assertEquals(principal.idGrupoDoPrincipalFacultativoFk, clone.idGrupoDoPrincipalFacultativoFk)
        assertEquals(principal.grupoDoPrincipalFacultativo, clone.grupoDoPrincipalFacultativo)
        assertEquals(principal.idPrincipalPk, clone.idPrincipalPk)
        assertEquals(principal.textoObrigatorio, clone.textoObrigatorio)
        assertEquals(principal.textoFacultativo, clone.textoFacultativo)
        assertEquals(principal.decimalObrigatorio, clone.decimalObrigatorio, 0.0)
        assertEquals(principal.decimalFacultativo, clone.decimalFacultativo)
        assertEquals(principal.inteiroObrigatorio, clone.inteiroObrigatorio)
        assertEquals(principal.inteiroFacultativo, clone.inteiroFacultativo)
        assertEquals(principal.booleanoObrigatorio, clone.booleanoObrigatorio)
        assertEquals(principal.booleanoFacultativo, clone.booleanoFacultativo)
        assertEquals(principal.dataObrigatoria, clone.dataObrigatoria)
        assertEquals(principal.dataFacultativa, clone.dataFacultativa)
        assertEquals(principal.datahoraObrigatoria, clone.datahoraObrigatoria)
        assertEquals(principal.datahoraFacultativa, clone.datahoraFacultativa)
        assertEquals(principal.ativo, clone.ativo)
        assertEquals(principal.email, clone.email)
        assertEquals(principal.senha, clone.senha)
        assertEquals(principal.urlImagem, clone.urlImagem)
        assertEquals(principal.url, clone.url)
        assertEquals(principal.unico, clone.unico)
        assertEquals(principal.dataCriacao, clone.dataCriacao)
        assertEquals(principal.dataAlteracao, clone.dataAlteracao)
        assertEquals(principal.nome, clone.nome)
        assertEquals(principal.titulo, clone.titulo)
        assertEquals(principal.cpf, clone.cpf)
        assertEquals(principal.cnpj, clone.cnpj)
        assertEquals(principal.rg, clone.rg)
        assertEquals(principal.celular, clone.celular)
        assertEquals(principal.textoGrande, clone.textoGrande)
        assertEquals(principal.tagPrincipal, clone.tagPrincipal)
    }
    
}
