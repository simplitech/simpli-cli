package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.ItemDoPrincipal
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for ItemDoPrincipal database operations
 * @author martinlabs CRUD generator
 */
class ItemDoPrincipalDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(idItemDoPrincipalPk: Long): ItemDoPrincipal? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM item_do_principal
            WHERE idItemDoPrincipalPk = ?
            """,
            { rs -> ItemDoPrincipal.buildAll(rs) }, 
            idItemDoPrincipalPk)
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<ItemDoPrincipal> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()


        orderRequestAndColumn.put("idPrincipalFk", "item_do_principal.idPrincipalFk")
        orderRequestAndColumn.put("idItemDoPrincipalPk", "item_do_principal.idItemDoPrincipalPk")
        orderRequestAndColumn.put("titulo", "item_do_principal.titulo")
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = ""

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                WHERE LOWER(CONCAT(
                IFNULL(item_do_principal.idPrincipalFk, ''),
                IFNULL(item_do_principal.idItemDoPrincipalPk, ''),
                IFNULL(item_do_principal.titulo, '')
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
            FROM item_do_principal
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> ItemDoPrincipal.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idItemDoPrincipalPk)
            FROM item_do_principal
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idItemDoPrincipalPk)
            FROM item_do_principal
            WHERE LOWER(CONCAT(
            IFNULL(item_do_principal.idPrincipalFk, ''),
            IFNULL(item_do_principal.idItemDoPrincipalPk, ''),
            IFNULL(item_do_principal.titulo, '')
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun updateItemDoPrincipal(itemDoPrincipal: ItemDoPrincipal): Int {
        //TODO: review generated method
        return update("""
            UPDATE item_do_principal SET
            idPrincipalFk = ?,
            titulo = ?
            WHERE idItemDoPrincipalPk = ?
            """,
            itemDoPrincipal.idPrincipalFk, 
            itemDoPrincipal.titulo, 
            itemDoPrincipal.idItemDoPrincipalPk).affectedRows
    }
    
    fun insert(itemDoPrincipal: ItemDoPrincipal): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO item_do_principal (
            idPrincipalFk,
            titulo
            ) VALUES (
            ?,?
            )
            """,
            itemDoPrincipal.idPrincipalFk,
            itemDoPrincipal.titulo).key
    }


}
