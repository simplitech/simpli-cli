<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.dao

import <%-packageAddress%>.model.<%-table.modelName%>
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for <%-table.modelName%> database operations
 * @author Simpli© CLI generator
 */
class <%-table.modelName%>Dao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(<%-table.primariesByComma(true)%>): <%-table.modelName%>? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM <%-table.name%>
            WHERE 1 = 1
            <%-table.primariesByWhere()%>
            """, { rs -> <%-table.modelName%>.buildAll(rs) }, <%-table.primariesByComma(false)%>)
    }

    fun list(): MutableList<<%-table.modelName%>> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM <%-table.name%>
<%_ if (table.isRemovable) _%>
            WHERE <%-table.removableColumn.name%> = 1
<%_ } _%>
            """, { rs -> <%-table.modelName%>.buildAll(rs) })
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<<%-table.modelName%>> {
        //TODO: review generated method
        val orderRequestAndColumn = HashMap<String, String>()

<%_ for (var i in table.columns) { var column = table.columns[i] _%>
        orderRequestAndColumn.put("<%-column.name%>", "<%-table.name%>.<%-column.name%>")
<%_ } _%>

        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
<%_ if (table.isRemovable) _%>
        var where = "WHERE <%-table.removableColumn.name%> = 1 "
<%_ } else { _%>
        var where = "WHERE 1 = 1 "
<%_ } _%>

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                AND LOWER(CONCAT(
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
                IFNULL(<%-table.name%>.<%-column.name%>, '')<%-i < table.columns.length - 1 ? ',' : ''%>
<%_ } _%>
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
            FROM <%-table.name%>
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """, { rs -> <%-table.modelName%>.buildAll(rs) }, *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(<%-table.columnId.name%>)
            FROM <%-table.name%>
<%_ if (table.isRemovable) { _%>
            WHERE <%-table.removableColumn.name%> = 1
<%_ } _%>
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(<%-table.columnId.name%>)
            FROM <%-table.name%>
            WHERE LOWER(CONCAT(
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
            IFNULL(<%-table.name%>.<%-column.name%>, '')<%-i < table.columns.length - 1 ? ',' : ''%>
<%_ } _%>
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun update<%-table.modelName%>(<%-table.instanceName%>: <%-table.modelName%>): Int {
        //TODO: review generated method
        return update("""
            UPDATE <%-table.name%>
            SET
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (column.isPassword) { _%>
            <%-column.name%> = IF(? IS NOT NULL, SHA2(?, 256), <%-column.name%>)<%-i < table.columns.length - 1 ? ',' : ''%>
<%_ } else if (column.isUpdatedAt) { _%>
            <%-column.name%> = NOW()<%-i < table.columns.length - 1 ? ',' : ''%>
<%_ } else { _%>
            <%-column.name%> = ?<%-i < table.columns.length - 1 ? ',' : ''%>
<%_ } _%>
<%_ } _%>
            WHERE 1 = 1
            <%-table.primariesByWhere()%>
            """,
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (column.isPassword) { _%>
            <%-table.instanceName%>.<%-column.name%>, <%-table.instanceName%>.<%-column.name%>,
<%_ } else if (column.isUpdatedAt) { _%>
<%_ } else { _%>
            <%-table.instanceName%>.<%-column.name%>,
<%_ } _%>
<%_ } _%>
            <%-table.primariesByComma(false)%>).affectedRows
    }
    
    fun insert(<%-table.instanceName%>: <%-table.modelName%>): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO <%-table.name%> (
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
            <%-column.name%><%-i < table.columns.length - 1 ? ',' : ''%>
<%_ } _%>
            ) VALUES (
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (column.isPassword) { _%>
            <%= 'SHA2(?, 256)' + (i < table.columns.length - 1 ? ',' : '') =%>
<%_ } else if (column.isCreatedAt) { _%>
            <%= 'NOW()' + (i < table.columns.length - 1 ? ',' : '') =%>
<%_ } else { _%>
            <%= '?' + (i < table.columns.length - 1 ? ',' : '') =%>
<%_ } _%>
<%_ } _%>
            )
            """,
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (column.isCreatedAt) { _%>
<%_ } else { _%>
            <%-table.instanceName%>.<%-column.name%><%-i < table.columns.length - 1 ? ',' : ''%>
<%_ } _%>
<%_ } _%>).key
    }

<%_ if (table.hasUnique) { _%>
    fun existUnico(<%-table.uniqueColumn.name%>: <%-table.uniqueColumn.kotlinType%>?, <%-table.primariesByComma(true)%>): Boolean {
        //TODO: review generated method
        return exist("""
            SELECT <%-table.uniqueColumn.name%>
            FROM <%-table.name%>
            WHERE <%-table.uniqueColumn.name%> = ?
            <%-table.primariesByWhere(true)%>
            """, <%-table.uniqueColumn.name%>, <%-table.primariesByComma(false)%>)
    }
<%_ } _%>

<%_ if (table.isRemovable) { _%>
    fun softDelete(<%-table.primariesByComma(true)%>): Int {
        //TODO: review generated method
        return update("""
            UPDATE <%-table.name%>
            SET <%-table.removableColumn.name%> = 0
            WHERE 1 = 1
            <%-table.primariesByWhere()%>
            """, <%-table.primariesByComma(false)%>).affectedRows
    }
<%_ } _%>
}
