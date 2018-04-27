package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.ConectorPrincipal
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for ConectorPrincipal database operations
 * @author martinlabs CRUD generator
 */
class ConectorPrincipalDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(idPrincipalFk: Long, idConectadoFk: Long): ConectorPrincipal? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM conector_principal
            WHERE idPrincipalFk = ?
            AND idConectadoFk = ?
            """,
            { rs -> ConectorPrincipal.buildAll(rs) }, 
            idPrincipalFk, 
            idConectadoFk)
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<ConectorPrincipal> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()


        orderRequestAndColumn.put("idConectadoFk", "conector_principal.idConectadoFk")
        orderRequestAndColumn.put("idPrincipalFk", "conector_principal.idPrincipalFk")
        orderRequestAndColumn.put("titulo", "conector_principal.titulo")
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = ""

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                WHERE LOWER(CONCAT(
                IFNULL(conector_principal.idConectadoFk, ''),
                IFNULL(conector_principal.idPrincipalFk, ''),
                IFNULL(conector_principal.titulo, '')
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
            FROM conector_principal
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> ConectorPrincipal.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idPrincipalFk)
            FROM conector_principal
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idPrincipalFk)
            FROM conector_principal
            WHERE LOWER(CONCAT(
            IFNULL(conector_principal.idConectadoFk, ''),
            IFNULL(conector_principal.idPrincipalFk, ''),
            IFNULL(conector_principal.titulo, '')
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun updateConectorPrincipal(conectorPrincipal: ConectorPrincipal): Int {
        //TODO: review generated method
        return update("""
            UPDATE conector_principal SET
            titulo = ?
            WHERE idPrincipalFk = ?
            AND idConectadoFk = ?
            """,
            conectorPrincipal.titulo, 
            conectorPrincipal.idPrincipalFk,
            conectorPrincipal.idConectadoFk).affectedRows
    }
    
    fun insert(conectorPrincipal: ConectorPrincipal): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO conector_principal (
            idConectadoFk,
            idPrincipalFk,
            titulo
            ) VALUES (
            ?,?,?
            )
            """,
            conectorPrincipal.idConectadoFk,
            conectorPrincipal.idPrincipalFk,
            conectorPrincipal.titulo).key
    }

    fun existConectorPrincipal(idPrincipalFk: Long, idConectadoFk: Long): Boolean {
        //TODO: review generated method
        return exist("""
            SELECT idPrincipalFk FROM conector_principal
            WHERE idPrincipalFk = ?
            AND idConectadoFk = ?
            """, idPrincipalFk, idConectadoFk)
    }


}
