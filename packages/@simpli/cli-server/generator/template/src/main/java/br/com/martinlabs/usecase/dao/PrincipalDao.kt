package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.Principal
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for Principal database operations
 * @author martinlabs CRUD generator
 */
class PrincipalDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(idPrincipalPk: Long): Principal? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM principal
            WHERE idPrincipalPk = ?
            """,
            { rs -> Principal.buildAll(rs) }, 
            idPrincipalPk)
    }

    fun list(): MutableList<Principal> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM principal 
            WHERE ativo = 1
            """,
            { rs -> Principal.buildAll(rs) })
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<Principal> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()


        orderRequestAndColumn.put("idGrupoDoPrincipalFk", "principal.idGrupoDoPrincipalFk")
        orderRequestAndColumn.put("idGrupoDoPrincipalFacultativoFk", "principal.idGrupoDoPrincipalFacultativoFk")
        orderRequestAndColumn.put("idPrincipalPk", "principal.idPrincipalPk")
        orderRequestAndColumn.put("textoObrigatorio", "principal.textoObrigatorio")
        orderRequestAndColumn.put("textoFacultativo", "principal.textoFacultativo")
        orderRequestAndColumn.put("decimalObrigatorio", "principal.decimalObrigatorio")
        orderRequestAndColumn.put("decimalFacultativo", "principal.decimalFacultativo")
        orderRequestAndColumn.put("inteiroObrigatorio", "principal.inteiroObrigatorio")
        orderRequestAndColumn.put("inteiroFacultativo", "principal.inteiroFacultativo")
        orderRequestAndColumn.put("booleanoObrigatorio", "principal.booleanoObrigatorio")
        orderRequestAndColumn.put("booleanoFacultativo", "principal.booleanoFacultativo")
        orderRequestAndColumn.put("dataObrigatoria", "principal.dataObrigatoria")
        orderRequestAndColumn.put("dataFacultativa", "principal.dataFacultativa")
        orderRequestAndColumn.put("datahoraObrigatoria", "principal.datahoraObrigatoria")
        orderRequestAndColumn.put("datahoraFacultativa", "principal.datahoraFacultativa")
        orderRequestAndColumn.put("ativo", "principal.ativo")
        orderRequestAndColumn.put("email", "principal.email")
        orderRequestAndColumn.put("urlImagem", "principal.urlImagem")
        orderRequestAndColumn.put("url", "principal.url")
        orderRequestAndColumn.put("unico", "principal.unico")
        orderRequestAndColumn.put("dataCriacao", "principal.dataCriacao")
        orderRequestAndColumn.put("dataAlteracao", "principal.dataAlteracao")
        orderRequestAndColumn.put("nome", "principal.nome")
        orderRequestAndColumn.put("titulo", "principal.titulo")
        orderRequestAndColumn.put("cpf", "principal.cpf")
        orderRequestAndColumn.put("cnpj", "principal.cnpj")
        orderRequestAndColumn.put("rg", "principal.rg")
        orderRequestAndColumn.put("celular", "principal.celular")
        orderRequestAndColumn.put("textoGrande", "principal.textoGrande")
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = "WHERE ativo = 1 "

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                AND LOWER(CONCAT(
                IFNULL(principal.idGrupoDoPrincipalFk, ''),
                IFNULL(principal.idGrupoDoPrincipalFacultativoFk, ''),
                IFNULL(principal.idPrincipalPk, ''),
                IFNULL(principal.textoObrigatorio, ''),
                IFNULL(principal.textoFacultativo, ''),
                IFNULL(principal.decimalObrigatorio, ''),
                IFNULL(principal.decimalFacultativo, ''),
                IFNULL(principal.inteiroObrigatorio, ''),
                IFNULL(principal.inteiroFacultativo, ''),
                IFNULL(principal.booleanoObrigatorio, ''),
                IFNULL(principal.booleanoFacultativo, ''),
                IFNULL(principal.dataObrigatoria, ''),
                IFNULL(principal.dataFacultativa, ''),
                IFNULL(principal.datahoraObrigatoria, ''),
                IFNULL(principal.datahoraFacultativa, ''),
                IFNULL(principal.ativo, ''),
                IFNULL(principal.email, ''),
                IFNULL(principal.urlImagem, ''),
                IFNULL(principal.url, ''),
                IFNULL(principal.unico, ''),
                IFNULL(principal.dataCriacao, ''),
                IFNULL(principal.dataAlteracao, ''),
                IFNULL(principal.nome, ''),
                IFNULL(principal.titulo, ''),
                IFNULL(principal.cpf, ''),
                IFNULL(principal.cnpj, ''),
                IFNULL(principal.rg, ''),
                IFNULL(principal.celular, ''),
                IFNULL(principal.textoGrande, '')
                )) LIKE LOWER(?)
                """)
            params.add("%$query%")
        }

        var limitQuery = ""
        if (page != null && limit != null) {
            limitQuery = "LIMIT ?, ? "
            params.add(page * limit)
            params.add(limit)
        }

        return selectList("""
            SELECT *
            FROM principal
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> Principal.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idPrincipalPk)
            FROM principal
            WHERE ativo = 1
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idPrincipalPk)
            FROM principal
            WHERE LOWER(CONCAT(
            IFNULL(principal.idGrupoDoPrincipalFk, ''),
            IFNULL(principal.idGrupoDoPrincipalFacultativoFk, ''),
            IFNULL(principal.idPrincipalPk, ''),
            IFNULL(principal.textoObrigatorio, ''),
            IFNULL(principal.textoFacultativo, ''),
            IFNULL(principal.decimalObrigatorio, ''),
            IFNULL(principal.decimalFacultativo, ''),
            IFNULL(principal.inteiroObrigatorio, ''),
            IFNULL(principal.inteiroFacultativo, ''),
            IFNULL(principal.booleanoObrigatorio, ''),
            IFNULL(principal.booleanoFacultativo, ''),
            IFNULL(principal.dataObrigatoria, ''),
            IFNULL(principal.dataFacultativa, ''),
            IFNULL(principal.datahoraObrigatoria, ''),
            IFNULL(principal.datahoraFacultativa, ''),
            IFNULL(principal.ativo, ''),
            IFNULL(principal.email, ''),
            IFNULL(principal.urlImagem, ''),
            IFNULL(principal.url, ''),
            IFNULL(principal.unico, ''),
            IFNULL(principal.dataCriacao, ''),
            IFNULL(principal.dataAlteracao, ''),
            IFNULL(principal.nome, ''),
            IFNULL(principal.titulo, ''),
            IFNULL(principal.cpf, ''),
            IFNULL(principal.cnpj, ''),
            IFNULL(principal.rg, ''),
            IFNULL(principal.celular, ''),
            IFNULL(principal.textoGrande, '')
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun updatePrincipal(principal: Principal): Int {
        //TODO: review generated method
        return update("""
            UPDATE principal SET
            idGrupoDoPrincipalFk = ?,
            idGrupoDoPrincipalFacultativoFk = ?,
            textoObrigatorio = ?,
            textoFacultativo = ?,
            decimalObrigatorio = ?,
            decimalFacultativo = ?,
            inteiroObrigatorio = ?,
            inteiroFacultativo = ?,
            booleanoObrigatorio = ?,
            booleanoFacultativo = ?,
            dataObrigatoria = ?,
            dataFacultativa = ?,
            datahoraObrigatoria = ?,
            datahoraFacultativa = ?,
            ativo = ?,
            email = ?,
            senha = IF(? IS NOT NULL, SHA2(?, 256), senha),
            urlImagem = ?,
            url = ?,
            unico = ?,
            dataAlteracao = NOW(),
            nome = ?,
            titulo = ?,
            cpf = ?,
            cnpj = ?,
            rg = ?,
            celular = ?,
            textoGrande = ?
            WHERE idPrincipalPk = ?
            """,
            principal.idGrupoDoPrincipalFk, 
            principal.idGrupoDoPrincipalFacultativoFk, 
            principal.textoObrigatorio, 
            principal.textoFacultativo, 
            principal.decimalObrigatorio, 
            principal.decimalFacultativo, 
            principal.inteiroObrigatorio, 
            principal.inteiroFacultativo, 
            principal.booleanoObrigatorio, 
            principal.booleanoFacultativo, 
            principal.dataObrigatoria, 
            principal.dataFacultativa, 
            principal.datahoraObrigatoria, 
            principal.datahoraFacultativa, 
            principal.ativo, 
            principal.email, 
            principal.senha, principal.senha,
            principal.urlImagem, 
            principal.url, 
            principal.unico, 
            principal.nome, 
            principal.titulo, 
            principal.cpf, 
            principal.cnpj, 
            principal.rg, 
            principal.celular, 
            principal.textoGrande, 
            principal.idPrincipalPk).affectedRows
    }
    
    fun insert(principal: Principal): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO principal (
            idGrupoDoPrincipalFk,
            idGrupoDoPrincipalFacultativoFk,
            textoObrigatorio,
            textoFacultativo,
            decimalObrigatorio,
            decimalFacultativo,
            inteiroObrigatorio,
            inteiroFacultativo,
            booleanoObrigatorio,
            booleanoFacultativo,
            dataObrigatoria,
            dataFacultativa,
            datahoraObrigatoria,
            datahoraFacultativa,
            ativo,
            email,
            senha,
            urlImagem,
            url,
            unico,
            dataCriacao,
            nome,
            titulo,
            cpf,
            cnpj,
            rg,
            celular,
            textoGrande
            ) VALUES (
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,SHA2(?, 256),?,?,?,NOW(),?,?,?,?,?,?,?
            )
            """,
            principal.idGrupoDoPrincipalFk,
            principal.idGrupoDoPrincipalFacultativoFk,
            principal.textoObrigatorio,
            principal.textoFacultativo,
            principal.decimalObrigatorio,
            principal.decimalFacultativo,
            principal.inteiroObrigatorio,
            principal.inteiroFacultativo,
            principal.booleanoObrigatorio,
            principal.booleanoFacultativo,
            principal.dataObrigatoria,
            principal.dataFacultativa,
            principal.datahoraObrigatoria,
            principal.datahoraFacultativa,
            principal.ativo,
            principal.email,
            principal.senha,
            principal.urlImagem,
            principal.url,
            principal.unico,
            principal.nome,
            principal.titulo,
            principal.cpf,
            principal.cnpj,
            principal.rg,
            principal.celular,
            principal.textoGrande).key
    }

    fun existUnico(unico: String?, idPrincipalPk: Long): Boolean {
        //TODO: review generated method
        return exist("""
            SELECT unico FROM principal
            WHERE unico = ?
            AND idPrincipalPk != ?
            """, 
            unico, idPrincipalPk)
    }

    fun softDelete(idPrincipalPk: Long): Int {
        //TODO: review generated method
        return update("""
            UPDATE principal SET
            ativo = 0
            WHERE idPrincipalPk = ?
            """,
            idPrincipalPk).affectedRows
        
    }


}
