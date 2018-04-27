package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.Tag
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for Tag database operations
 * @author martinlabs CRUD generator
 */
class TagDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(idTagPk: Long): Tag? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM tag
            WHERE idTagPk = ?
            """,
            { rs -> Tag.buildAll(rs) }, 
            idTagPk)
    }

    fun list(): MutableList<Tag> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM tag 
            """,
            { rs -> Tag.buildAll(rs) })
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<Tag> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()


        orderRequestAndColumn.put("idTagPk", "tag.idTagPk")
        orderRequestAndColumn.put("titulo", "tag.titulo")
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = ""

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                WHERE LOWER(CONCAT(
                IFNULL(tag.idTagPk, ''),
                IFNULL(tag.titulo, '')
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
            FROM tag
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> Tag.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idTagPk)
            FROM tag
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idTagPk)
            FROM tag
            WHERE LOWER(CONCAT(
            IFNULL(tag.idTagPk, ''),
            IFNULL(tag.titulo, '')
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun updateTag(tag: Tag): Int {
        //TODO: review generated method
        return update("""
            UPDATE tag SET
            titulo = ?
            WHERE idTagPk = ?
            """,
            tag.titulo, 
            tag.idTagPk).affectedRows
    }
    
    fun insert(tag: Tag): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO tag (
            titulo
            ) VALUES (
            ?
            )
            """,
            tag.titulo).key
    }


}
