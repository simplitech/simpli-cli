package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.GrupoDoPrincipal
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for GrupoDoPrincipal database operations
 * @author martinlabs CRUD generator
 */
class GrupoDoPrincipalDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(idGrupoDoPrincipalPk: Long): GrupoDoPrincipal? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM grupo_do_principal
            WHERE idGrupoDoPrincipalPk = ?
            """,
            { rs -> GrupoDoPrincipal.buildAll(rs) }, 
            idGrupoDoPrincipalPk)
    }

    fun list(): MutableList<GrupoDoPrincipal> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM grupo_do_principal 
            """,
            { rs -> GrupoDoPrincipal.buildAll(rs) })
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<GrupoDoPrincipal> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()


        orderRequestAndColumn.put("idGrupoDoPrincipalPk", "grupo_do_principal.idGrupoDoPrincipalPk")
        orderRequestAndColumn.put("titulo", "grupo_do_principal.titulo")
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = ""

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                WHERE LOWER(CONCAT(
                IFNULL(grupo_do_principal.idGrupoDoPrincipalPk, ''),
                IFNULL(grupo_do_principal.titulo, '')
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
            FROM grupo_do_principal
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> GrupoDoPrincipal.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idGrupoDoPrincipalPk)
            FROM grupo_do_principal
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idGrupoDoPrincipalPk)
            FROM grupo_do_principal
            WHERE LOWER(CONCAT(
            IFNULL(grupo_do_principal.idGrupoDoPrincipalPk, ''),
            IFNULL(grupo_do_principal.titulo, '')
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun updateGrupoDoPrincipal(grupoDoPrincipal: GrupoDoPrincipal): Int {
        //TODO: review generated method
        return update("""
            UPDATE grupo_do_principal SET
            titulo = ?
            WHERE idGrupoDoPrincipalPk = ?
            """,
            grupoDoPrincipal.titulo, 
            grupoDoPrincipal.idGrupoDoPrincipalPk).affectedRows
    }
    
    fun insert(grupoDoPrincipal: GrupoDoPrincipal): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO grupo_do_principal (
            titulo
            ) VALUES (
            ?
            )
            """,
            grupoDoPrincipal.titulo).key
    }


}
