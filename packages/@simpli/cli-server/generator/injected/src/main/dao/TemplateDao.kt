<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.dao

<%_ if (!table.isPivot) { _%>
import <%-packageAddress%>.model.resource.<%-table.modelName%>
import br.com.simpli.sql.AbstractConnector
import br.com.simpli.sql.Query
<%_ } else { _%>
<%_ var cache = [] _%>
<%_ for (var i in table.foreignColumns) { var column = table.foreignColumns[i] _%>
<%_ if (!cache.includes(column.foreign.referencedTableModelName)) { _%>
import <%-packageAddress%>.model.resource.<%-column.foreign.referencedTableModelName%>
<%_ cache.push(column.foreign.referencedTableModelName) _%>
<%_ } _%>
<%_ } _%>
import br.com.simpli.sql.AbstractConnector
import br.com.simpli.sql.Query
<%_ } _%>

/**
 * Data Access Object of <%-table.modelName%> from table <%-table.name%>
 * @author Simpli CLI generator
 */
class <%-table.modelName%>Dao(con: AbstractConnector) {

<%_ if (!table.isPivot) { _%>
    fun getOne(<%-table.primariesByParam()%>): <%-table.modelName%>? {
        // TODO: review generated method
        val query = Query()
                .selectAll()
                .from("<%-table.name%>")
                <%-table.primariesByWhere()%>

        return con.getOne(query) {
            <%-table.modelName%>(it)
        }
    }

    fun getList(param: <%-table.modelName%>.ListParam = <%-table.modelName%>.ListParam()): MutableList<<%-table.modelName%>> {
        // TODO: review generated method
        val query = Query()
                .selectAll()
                .from("<%-table.name%>")
<%_ if (table.isRemovable) { _%>
                .whereEq("<%-table.removableColumn.field%>", true)
<%_ } _%>

        param.query?.also {
            if (it.isNotEmpty()) {
                query.where(Query()
<%_ for (var i in table.queryColumns) { var column = table.queryColumns[i] _%>
                        .orLike("<%-table.name%>.<%-column.field%>", "%$it%")
<%_ } _%>
                )
            }
        }

        val orderMap = mapOf(
<%_ for (var i in table.exceptPasswordColumns) { var column = table.exceptPasswordColumns[i] _%>
                "<%-column.name%>" to "<%-table.name%>.<%-column.field%>"<%-i < table.exceptPasswordColumns.length - 1 ? ',' : ''%>
<%_ } _%>
        )

        orderMap[param.orderBy]?.also {
            query.orderByAsc(it, param.ascending)
        }

        param.limit?.also {
            val index = (param.page ?: 0) * it
            query.limit(index, it)
        }

        return con.getList(query) {
            <%-table.modelName%>(it)
        }
    }

    fun count(param: <%-table.modelName%>.ListParam = <%-table.modelName%>.ListParam()): Int {
        // TODO: review generated method
        val query = Query()
                .countRaw("DISTINCT <%-table.idColumn.field%>")
                .from("<%-table.name%>")
<%_ if (table.isRemovable) { _%>
                .whereEq("<%-table.removableColumn.field%>", true)
<%_ } _%>

        param.query?.also {
            if (it.isNotEmpty()) {
                query.where(Query()
<%_ for (var i in table.queryColumns) { var column = table.queryColumns[i] _%>
                        .orLike("<%-table.name%>.<%-column.field%>", "%$it%")
<%_ } _%>
                )
            }
        }

        return con.getFirstInt(query) ?: 0
    }

    fun update(<%-table.instanceName%>: <%-table.modelName%>): Int {
        // TODO: review generated method
        val query = Query()
                .updateTable("<%-table.name%>")
                .updateSet(<%-table.instanceName%>.updateSet())
                <%-table.primariesByWhere(false, table.instanceName)%>

        return con.execute(query).affectedRows
    }

    fun insert(<%-table.instanceName%>: <%-table.modelName%>): Long {
        // TODO: review generated method
        val query = Query()
                .insertInto("<%-table.name%>")
                .insertValues(<%-table.instanceName%>.insertValues())

        return con.execute(query).key
    }

    fun exist(<%-table.primariesByParam()%>): Boolean {
        // TODO: review generated method
        val query = Query()
                .select("<%-table.idColumn.field%>")
                .from("<%-table.name%>")
                <%-table.primariesByWhere()%>

        return con.exist(query)
    }

<%_ for (var i in table.uniqueColumns) { var column = table.uniqueColumns[i] _%>
    fun exist<%-options.serverSetup.capitalizeFirstLetter(column.name)%>(<%-column.name%>: <%-column.kotlinType%>, <%-table.primariesByParam()%>): Boolean {
        // TODO: review generated method
        val query = Query()
                .select("<%-column.field%>")
                .from("<%-table.name%>")
                .whereEq("<%-column.field%>", <%-column.name%>)
                <%-table.primariesByWhere(true)%>

        return con.exist(query)
    }
<%_ } _%>
<%_ if (table.isRemovable) { _%>

    fun softDelete(<%-table.primariesByParam()%>): Int {
        // TODO: review generated method
        val query = Query()
                .updateTable("<%-table.name%>")
                .updateSet("<%-table.removableColumn.field%>" to false)
                <%-table.primariesByWhere()%>

        return con.execute(query).affectedRows
    }
<%_ } _%>
<%_ } else if (table.isPivot) { _%>
<%_ var foreignColumns = table.foreignColumns _%>
<%_ var columnRef1 = foreignColumns[0] _%>
<%_ var columnRef2 = foreignColumns[1] _%>
    fun insert(<%-table.primariesByParam()%>): Long {
        // TODO: review generated method
        val query = Query()
                .insertInto("<%-table.name%>")
                .insertValues(
<%_ for (var i in foreignColumns) { var column = foreignColumns[i] _%>
                        "<%-column.field%>" to <%-column.name%><%-i < foreignColumns.length - 1 ? ',' : ''%>
<%_ } _%>
                )

        return con.execute(query).key
    }

<%_ var cache = [] _%>
<%_ for (var i in foreignColumns) { var column = foreignColumns[i] _%>
<%_ var columnRef = column.name === columnRef1.name ? columnRef2 : columnRef1 _%>
<%_ var columnCross = column.name === columnRef2.name ? columnRef2 : columnRef1 _%>
<%_ if (!cache.includes(columnRef.foreign.referencedTableModelName)) { _%>
    fun removeAllFrom<%-columnRef.foreign.referencedTableModelName%>(<%-columnRef.name%>: <%-columnRef.kotlinType%>): Int {
        // TODO: review generated method
        val query = Query()
                .deleteFrom("<%-table.name%>")
                .whereEq("<%-columnRef.field%>", <%-columnRef.name%>)

        return con.execute(query).affectedRows
    }

    fun list<%-columnRef.foreign.referencedTableModelName%>Of<%-columnCross.foreign.referencedTableModelName%>(<%-columnCross.name%>: <%-columnCross.kotlinType%>): MutableList<<%-columnRef.foreign.referencedTableModelName%>> {
        // TODO: review generated method
        val query = Query()
                .selectAll()
                .from("<%-columnRef.foreign.referencedTableName%>")
                .innerJoin("<%-table.name%>", "<%-columnRef.foreign.referencedTableName%>.<%-columnRef.foreign.referencedColumnName%>", "<%-table.name%>.<%-columnRef.field%>")
                .whereEq("<%-table.name%>.<%-columnCross.field%>", <%-columnCross.name%>)

        return con.getList(query) {
            <%-columnRef.foreign.referencedTableModelName%>(it)
        }
    }

<%_ cache.push(columnRef.foreign.referencedTableModelName) _%>
<%_ } _%>
<%_ } _%>
<%_ } _%>
}
