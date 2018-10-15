<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.dao

<%_ if (!table.isPivot) { _%>
import <%-packageAddress%>.model.<%-table.modelName%>
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.Dao
<%_ } else { _%>
<%_ for (var i in table.foreignColumns) { var column = table.foreignColumns[i] _%>
import <%-packageAddress%>.model.<%-column.foreign.referencedTableModelName%>
<%_ } _%>
import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.Dao
import java.sql.Connection
<%_ } _%>

/**
 * Responsible for <%-table.modelName%> database operations
 * @author Simpli© CLI generator
 */
class <%-table.modelName%>Dao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
<%_ if (!table.isPivot) { _%>
    fun getOne(<%-table.primariesByParam()%>): <%-table.modelName%>? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM <%-table.name%>
            WHERE 1 = 1
            <%-table.primariesByWhere()%>
            """, { rs -> <%-table.modelName%>.buildAll(rs) }, <%-table.primariesByComma(true)%>)
    }

    fun list(): MutableList<<%-table.modelName%>> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM <%-table.name%>
<%_ if (table.isRemovable) { _%>
            WHERE <%-table.removableColumn.field%> = 1
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
<%_ if (!column.isPassword) { _%>
        orderRequestAndColumn.put("<%-column.name%>", "<%-table.name%>.<%-column.field%>")
<%_ } _%>
<%_ } _%>

        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
<%_ if (table.isRemovable) { _%>
        var where = "WHERE <%-table.removableColumn.field%> = 1 "
<%_ } else { _%>
        var where = "WHERE 1 = 1 "
<%_ } _%>

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                AND LOWER(CONCAT(
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (!column.isPassword) { _%>
<%_ if (table.columns[table.columns.length - 1].isPassword) { _%>
                IFNULL(<%-table.name%>.<%-column.field%>, '')<%-i < table.columns.length - 2 ? ',' : ''%>
<%_ } else { _%>
                IFNULL(<%-table.name%>.<%-column.field%>, '')<%-i < table.columns.length - 1 ? ',' : ''%>
<%_ } _%>
<%_ } _%>
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
            SELECT COUNT(<%-table.idColumn.field%>)
            FROM <%-table.name%>
<%_ if (table.isRemovable) { _%>
            WHERE <%-table.removableColumn.field%> = 1
<%_ } _%>
            """)
    }

    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(<%-table.idColumn.field%>)
            FROM <%-table.name%>
            WHERE LOWER(CONCAT(
<%_ for (var i in table.columns) { var column = table.columns[i] _%>
<%_ if (!column.isPassword) { _%>
<%_ if (table.columns[table.columns.length - 1].isPassword) { _%>
                IFNULL(<%-table.name%>.<%-column.field%>, '')<%-i < table.columns.length - 2 ? ',' : ''%>
<%_ } else { _%>
            IFNULL(<%-table.name%>.<%-column.field%>, '')<%-i < table.columns.length - 1 ? ',' : ''%>
<%_ } _%>
<%_ } _%>
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
<%_ for (var i in table.exceptIDColumns) { var column = table.exceptIDColumns[i] _%>
<%_ if (column.isPassword) { _%>
            <%-column.field%> = IF(? IS NOT NULL, SHA2(?, 256), <%-column.field%>)<%-i < table.exceptIDColumns.length - 1 ? ',' : ''%>
<%_ } else if (column.isUpdatedAt) { _%>
            <%-column.field%> = NOW()<%-i < table.exceptIDColumns.length - 1 ? ',' : ''%>
<%_ } else if (!column.isCreatedAt) { _%>
            <%-column.field%> = ?<%-i < table.exceptIDColumns.length - 1 ? ',' : ''%>
<%_ } _%>
<%_ } _%>
            WHERE 1 = 1
            <%-table.primariesByWhere()%>
            """,
<%_ for (var i in table.exceptIDColumns) { var column = table.exceptIDColumns[i] _%>
<%_ if (column.isPassword) { _%>
            <%-table.instanceName%>.<%-column.name%>, <%-table.instanceName%>.<%-column.name%>,
<%_ } else if (column.isUpdatedAt) { _%>
<%_ } else if (!column.isCreatedAt) { _%>
            <%-table.instanceName%>.<%-column.name%>,
<%_ } _%>
<%_ } _%>
<%_ for (var i in table.primaryColumns) { var column = table.primaryColumns[i] _%>
            <%-table.instanceName%>.<%-column.name%><%-i < table.primaryColumns.length - 1 ? ',' : ''%>
<%_ } _%>
        ).affectedRows
    }

    fun insert(<%-table.instanceName%>: <%-table.modelName%>): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO <%-table.name%> (
<%_ for (var i in table.exceptIDColumns) { var column = table.exceptIDColumns[i] _%>
<%_ if (!column.isUpdatedAt) { _%>
            <%-column.field%><%-i < table.exceptIDColumns.length - 1 ? ',' : ''%>
<%_ } _%>
<%_ } _%>
            ) VALUES (<%_ for (var i in table.exceptIDColumns) { var column = table.exceptIDColumns[i] _%>
<%_ if (column.isPassword) { _%>
<%- 'SHA2(?, 256)' + (i < table.exceptIDColumns.length - 1 ? ',' : '') -%>
<%_ } else if (column.isCreatedAt) { _%>
<%- 'NOW()' + (i < table.exceptIDColumns.length - 1 ? ',' : '') -%>
<%_ } else if (!column.isUpdatedAt) { _%>
<%- '?' + (i < table.exceptIDColumns.length - 1 ? ',' : '') -%>
<%_ } _%>
<%_ } _%>)
            """,
<%_ for (var i in table.exceptIDColumns) { var column = table.exceptIDColumns[i] _%>
<%_ if (column.isCreatedAt) { _%>
<%_ } else if (!column.isUpdatedAt) { _%>
            <%-table.instanceName%>.<%-column.name%><%-i < table.exceptIDColumns.length - 1 ? ',' : ''%>
<%_ } _%>
<%_ } _%>
        ).key
    }

    fun exist<%-table.modelName%>(<%-table.primariesByParam()%>): Boolean {
        //TODO: review generated method
        return exist("""
            SELECT <%-table.idColumn.field%>
            FROM <%-table.name%>
            WHERE 1 = 1
            <%-table.primariesByWhere()%>
            """, <%-table.primariesByComma(true)%>)
    }

<%_ for (var i in table.uniqueColumns) { var column = table.uniqueColumns[i] _%>
    fun exist<%-options.serverSetup.capitalizeFirstLetter(column.name)%>(<%-column.name%>: <%-column.kotlinType%>?, <%-table.primariesByParam()%>): Boolean {
        //TODO: review generated method
        return exist("""
            SELECT <%-column.field%>
            FROM <%-table.name%>
            WHERE <%-column.field%> = ?
            <%-table.primariesByWhere(true)%>
            """, <%-column.name%>, <%-table.primariesByComma(true)%>)
    }
<%_ } _%>
<%_ if (table.isRemovable) { _%>

    fun softDelete(<%-table.primariesByParam()%>): Int {
        //TODO: review generated method
        return update("""
            UPDATE <%-table.name%>
            SET <%-table.removableColumn.field%> = 0
            WHERE 1 = 1
            <%-table.primariesByWhere()%>
            """, <%-table.primariesByComma(true)%>).affectedRows
    }
<%_ } _%>
<%_ } else if (table.isPivot) { _%>
<%_ var foreignColumns = table.foreignColumns _%>
<%_ var columnRef1 = foreignColumns[0] _%>
<%_ var columnRef2 = foreignColumns[1] _%>
    fun insert(<%-table.primariesByParam()%>): Int {
        //TODO: review generated method
        return update("""
            INSERT INTO <%-table.name%> (
<%_ for (var i in foreignColumns) { var column = foreignColumns[i] _%>
            <%-column.field%><%-i < foreignColumns.length - 1 ? ',' : ''%>
<%_ } _%>
            ) VALUES (<%_ for (var i in foreignColumns) { var column = foreignColumns[i] _%>
<%- '?' + (i < foreignColumns.length - 1 ? ',' : '') -%>
<%_ } _%>)
            """,
<%_ for (var i in foreignColumns) { var column = foreignColumns[i] _%>
            <%-column.name%><%-i < foreignColumns.length - 1 ? ',' : ''%>
<%_ } _%>
        ).affectedRows
    }

<%_ for (var i in foreignColumns) { var column = foreignColumns[i] _%>
<%_ var columnRef = column.name === columnRef1.name ? columnRef2 : columnRef1 _%>
<%_ var columnCross = column.name === columnRef2.name ? columnRef2 : columnRef1 _%>
    fun removeAllFrom<%-columnRef.foreign.referencedTableModelName%>(<%-columnRef.name%>: <%-columnRef.kotlinType%>): Int {
        //TODO: review generated method
        return update("DELETE FROM <%-table.name%> WHERE <%-columnRef.field%> = ? ",
            <%-columnRef.name%>).affectedRows
    }

    fun list<%-columnRef.foreign.referencedTableModelName%>Of<%-columnCross.foreign.referencedTableModelName%>(<%-columnCross.name%>: <%-columnCross.kotlinType%>): MutableList<<%-columnRef.foreign.referencedTableModelName%>> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM <%-columnRef.foreign.referencedTableName%>
            INNER JOIN <%-table.name%> ON <%-columnRef.foreign.referencedTableName%>.<%-columnRef.foreign.referencedColumnName%> = <%-table.name%>.<%-columnRef.field%>
            WHERE <%-table.name%>.<%-columnCross.field%> = ?
            """, { rs -> <%-columnRef.foreign.referencedTableModelName%>.buildAll(rs) }, <%-columnCross.name%>)
    }

<%_ } _%>
<%_ } _%>
}
