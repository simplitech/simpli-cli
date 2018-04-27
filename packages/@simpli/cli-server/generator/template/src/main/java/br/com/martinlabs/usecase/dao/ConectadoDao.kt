package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.Conectado
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for Conectado database operations
 * @author martinlabs CRUD generator
 */
class ConectadoDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(idConectadoPk: Long): Conectado? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM conectado
            WHERE idConectadoPk = ?
            """,
            { rs -> Conectado.buildAll(rs) }, 
            idConectadoPk)
    }

    fun list(): MutableList<Conectado> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM conectado 
            """,
            { rs -> Conectado.buildAll(rs) })
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<Conectado> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()


        orderRequestAndColumn.put("idConectadoPk", "conectado.idConectadoPk")
        orderRequestAndColumn.put("titulo", "conectado.titulo")
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = ""

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                WHERE LOWER(CONCAT(
                IFNULL(conectado.idConectadoPk, ''),
                IFNULL(conectado.titulo, '')
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
            FROM conectado
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> Conectado.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idConectadoPk)
            FROM conectado
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idConectadoPk)
            FROM conectado
            WHERE LOWER(CONCAT(
            IFNULL(conectado.idConectadoPk, ''),
            IFNULL(conectado.titulo, '')
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun updateConectado(conectado: Conectado): Int {
        //TODO: review generated method
        return update("""
            UPDATE conectado SET
            titulo = ?
            WHERE idConectadoPk = ?
            """,
            conectado.titulo, 
            conectado.idConectadoPk).affectedRows
    }
    
    fun insert(conectado: Conectado): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO conectado (
            titulo
            ) VALUES (
            ?
            )
            """,
            conectado.titulo).key
    }


}
