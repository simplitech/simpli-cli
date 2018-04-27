package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.ExtensaoDoPrincipal
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for ExtensaoDoPrincipal database operations
 * @author martinlabs CRUD generator
 */
class ExtensaoDoPrincipalDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(idPrincipalFk: Long): ExtensaoDoPrincipal? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM extensao_do_principal
            WHERE idPrincipalFk = ?
            """,
            { rs -> ExtensaoDoPrincipal.buildAll(rs) }, 
            idPrincipalFk)
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<ExtensaoDoPrincipal> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()


        orderRequestAndColumn.put("idPrincipalFk", "extensao_do_principal.idPrincipalFk")
        orderRequestAndColumn.put("titulo", "extensao_do_principal.titulo")
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = ""

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                WHERE LOWER(CONCAT(
                IFNULL(extensao_do_principal.idPrincipalFk, ''),
                IFNULL(extensao_do_principal.titulo, '')
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
            FROM extensao_do_principal
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> ExtensaoDoPrincipal.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idPrincipalFk)
            FROM extensao_do_principal
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idPrincipalFk)
            FROM extensao_do_principal
            WHERE LOWER(CONCAT(
            IFNULL(extensao_do_principal.idPrincipalFk, ''),
            IFNULL(extensao_do_principal.titulo, '')
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun updateExtensaoDoPrincipal(extensaoDoPrincipal: ExtensaoDoPrincipal): Int {
        //TODO: review generated method
        return update("""
            UPDATE extensao_do_principal SET
            titulo = ?
            WHERE idPrincipalFk = ?
            """,
            extensaoDoPrincipal.titulo, 
            extensaoDoPrincipal.idPrincipalFk).affectedRows
    }
    
    fun insert(extensaoDoPrincipal: ExtensaoDoPrincipal): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO extensao_do_principal (
            idPrincipalFk,
            titulo
            ) VALUES (
            ?,?
            )
            """,
            extensaoDoPrincipal.idPrincipalFk,
            extensaoDoPrincipal.titulo).key
    }

    fun existExtensaoDoPrincipal(idPrincipalFk: Long): Boolean {
        //TODO: review generated method
        return exist("""
            SELECT idPrincipalFk FROM extensao_do_principal
            WHERE idPrincipalFk = ?
            """, idPrincipalFk)
    }


}
