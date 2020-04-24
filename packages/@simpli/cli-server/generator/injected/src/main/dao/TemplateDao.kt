<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.dao

<%_ if (!table.isPivot) { _%>
import <%-packageAddress%>.model.filter.<%-table.modelName%>ListFilter
import <%-packageAddress%>.model.resource.<%-table.modelName%>
import <%-packageAddress%>.model.rm.<%-table.modelName%>RM
<%_ for (var i in table.validDistinctNotManyToManyRelations) { var relation = table.validDistinctNotManyToManyRelations[i] _%>
import <%-packageAddress%>.model.rm.<%-relation.referencedTableModelName%>RM
<%_ } _%>
import br.com.simpli.sql.AbstractConnector
import br.com.simpli.sql.Query
<%_ } else { _%>
<%_ var cache = [] _%>
<%_ for (var i in table.foreignColumns) { var column = table.foreignColumns[i] _%>
<%_ if (!cache.includes(column.foreign.referencedTableModelName)) { _%>
import <%-packageAddress%>.model.resource.<%-column.foreign.referencedTableModelName%>
import <%-packageAddress%>.model.rm.<%-column.foreign.referencedTableModelName%>RM
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
class <%-table.modelName%>Dao(val con: AbstractConnector) {
<%_ if (!table.isPivot) { _%>
    fun getOne(<%-table.primariesByParam()%>): <%-table.modelName%>? {
        // TODO: review generated method
        val query = Query()
                .select<%-table.modelName%>()
                .from("<%-table.name%>")
                <%-table.primariesByWhere()%>

        return con.getOne(query) {
            <%-table.modelName%>RM.build(it)
        }
    }

    fun getList(filter: <%-table.modelName%>ListFilter): MutableList<<%-table.modelName%>> {
        // TODO: review generated method
        val query = Query()
<%-table.buildSelectDao()-%>
                .from("<%-table.name%>")
<%-table.buildJoinDao()-%>
                .where<%-table.modelName%>Filter(filter)
                .orderAndLimit<%-table.modelName%>(filter)

        return con.getList(query) {
<%-table.buildRMDao()-%>
        }
    }

    fun count(filter: <%-table.modelName%>ListFilter): Int {
        // TODO: review generated method
        val query = Query()
                .countRaw("DISTINCT <%-table.idColumn.field%>")
                .from("<%-table.name%>")
                .where<%-table.modelName%>Filter(filter)

        return con.getFirstInt(query) ?: 0
    }

    fun update(<%-table.instanceName%>: <%-table.modelName%>): Int {
        // TODO: review generated method
        val query = Query()
                .updateTable("<%-table.name%>")
                .update<%-table.modelName%>Set(<%-table.instanceName%>)
                <%-table.primariesByWhere(false, table.instanceName)%>

        return con.execute(query).affectedRows
    }

    fun insert(<%-table.instanceName%>: <%-table.modelName%>): Long {
        // TODO: review generated method
        val query = Query()
                .insertInto("<%-table.name%>")
                .insert<%-table.modelName%>Values(<%-table.instanceName%>)

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
    private fun Query.select<%-table.modelName%>() = selectFields(<%-table.modelName%>RM.selectFields())

    private fun Query.update<%-table.modelName%>Set(<%-table.instanceName%>: <%-table.modelName%>) = updateSet(<%-table.modelName%>RM.updateSet(<%-table.instanceName%>))

    private fun Query.insert<%-table.modelName%>Values(<%-table.instanceName%>: <%-table.modelName%>) = insertValues(<%-table.modelName%>RM.insertValues(<%-table.instanceName%>))

    private fun Query.where<%-table.modelName%>Filter(filter: <%-table.modelName%>ListFilter, alias: String = "<%-table.name%>"): Query {
<%_ if (table.isRemovable) { _%>
        whereEq("$alias.<%-table.removableColumn.field%>", true)

<%_ } _%>
        filter.query?.also {
            if (it.isNotEmpty()) {
                whereSomeLikeThis(<%-table.modelName%>RM.fieldsToSearch(alias), "%$it%")
            }
        }

<%_ for (var i in table.foreignColumns) { var column = table.foreignColumns[i] _%>
<%-column.buildFilterDao()-%>
<%_ } _%>
<%_ for (var i in table.dateColumns) { var column = table.dateColumns[i] _%>
<%-column.buildFilterDao()-%>
<%_ } _%>
<%_ for (var i in table.numberColumns) { var column = table.numberColumns[i] _%>
<%-column.buildFilterDao()-%>
<%_ } _%>
<%_ for (var i in table.booleanColumns) { var column = table.booleanColumns[i] _%>
<%_ if (!column.isSoftDelete) { _%>
<%-column.buildFilterDao()-%>
<%_ } _%>
<%_ } _%>
        return this
    }

    private fun Query.orderAndLimit<%-table.modelName%>(filter: <%-table.modelName%>ListFilter, alias: String = "<%-table.name%>"): Query {
        <%-table.modelName%>RM.orderMap(alias)[filter.orderBy]?.also {
            orderByAsc(it, filter.ascending)
        }

        filter.limit?.also {
            val index = (filter.page ?: 0) * it
            limit(index, it)
        }

        return this
    }
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
                .selectFields(<%-columnRef.foreign.referencedTableModelName%>RM.selectFields())
                .from("<%-columnRef.foreign.referencedTableName%>")
                .innerJoin("<%-table.name%>", "<%-columnRef.foreign.referencedTableName%>.<%-columnRef.foreign.referencedColumnName%>", "<%-table.name%>.<%-columnRef.field%>")
                .whereEq("<%-table.name%>.<%-columnCross.field%>", <%-columnCross.name%>)

        return con.getList(query) {
            <%-columnRef.foreign.referencedTableModelName%>RM.build(it)
        }
    }

<%_ cache.push(columnRef.foreign.referencedTableModelName) _%>
<%_ } _%>
<%_ } _%>
<%_ } _%>
}
