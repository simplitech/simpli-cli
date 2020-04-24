<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.process

import <%-packageAddress%>.<%-moduleName%>.context.RequestContext
import <%-packageAddress%>.dao.<%-table.modelName%>Dao
<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>
<%_ if (m2m.pivotModelName !== table.modelName) { _%>
import <%-packageAddress%>.dao.<%-m2m.pivotModelName%>Dao
<%_ } _%>
<%_ } _%>
import <%-packageAddress%>.model.filter.<%-table.modelName%>ListFilter
import <%-packageAddress%>.model.resource.<%-table.modelName%>
import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.exception.response.NotFoundException
import br.com.simpli.model.PageCollection
import java.util.Date

/**
 * <%-table.modelName%> business logic
 * @author Simpli CLI generator
 */
class <%-table.modelName%>Process(val context: RequestContext) {

    val dao = <%-table.modelName%>Dao(context.con)

    fun get(<%-table.primariesByParam(true, true)%>): <%-table.modelName%> {
        // TODO: review generated method
<%_ if (table.idsColumn.length <= 1) { _%>
        if (id == null) throw BadRequestException()
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        if (id<%-(Number(i) + 1)%> == null) throw BadRequestException()
<%_ } _%>
<%_ } _%>

<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>
        val <%-m2m.pivotInstanceName%>Dao = <%-m2m.pivotModelName%>Dao(context.con)

<%_ } _%>
<%_ if (table.manyToMany.length) { _%>
        val model = dao.getOne(id) ?: throw NotFoundException()
<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>
        model.<%-m2m.pivotInstanceName%> = <%-m2m.pivotInstanceName%>Dao.list<%-m2m.crossRelationModelName%>Of<%-table.modelName%>(id)
<%_ } _%>

        return model
<%_ } else { _%>
        return dao.getOne(<%-table.primariesByParamCall()%>) ?: throw NotFoundException()
<%_ } _%>
    }

    fun list(filter: <%-table.modelName%>ListFilter): PageCollection<<%-table.modelName%>> {
        // TODO: review generated method
        val items = dao.getList(filter)
        val total = dao.count(filter)

        return PageCollection(items, total)
    }

<%_ if (table.hasPersist) { _%>
    /**
     * Use this to handle similarities between create and update
     */
    fun persist(model: <%-table.modelName%>): Long {
<%_ if (table.idsColumn.length <= 1) { _%>
        if (model.id > <%-table.idColumn.isString ? '\"\"' : '0'%>) {
            update(model)
        } else {
            create(model)
        }

<%_ } else { _%>
        val exist = dao.exist(<%-table.primariesByParamCall('model')%>)

        if (exist) {
            update(model)
        } else {
            create(model)
        }

<%_ } _%>
<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>
        val <%-m2m.pivotInstanceName%>Dao = <%-m2m.pivotModelName%>Dao(context.con)

        <%-m2m.pivotInstanceName%>Dao.removeAllFrom<%-table.modelName%>(model.id)

        model.<%-m2m.pivotInstanceName%>?.let { list ->
<%_ if (table.idColumn.name === m2m.crossRelationColumnName) { _%>
            list.forEach { <%-m2m.pivotInstanceName%>Dao.insert(it.id, model.id) }
<%_ } else { _%>
            list.forEach { <%-m2m.pivotInstanceName%>Dao.insert(model.id, it.id) }
<%_ } _%>
        }

<%_ } _%>
<%_ if (table.idsColumn.length <= 1) { _%>
        return model.id
<%_ } else { _%>
        return model.id1
<%_ } _%>
    }

    fun create(model: <%-table.modelName%>): Long {
        // TODO: review generated method
<%-table.buildCreateApplyModel()%>
<%_ if (table.idsColumn.length <= 1) { _%>
        model.id = dao.run {
            validate(model, updating = false)
            insert(model)
        }

        return model.id
<%_ } else { _%>
        dao.run {
            validate(model, updating = false)
            insert(model)
        }

        return 1L
<%_ } _%>
    }

    fun update(model: <%-table.modelName%>): Int {
        // TODO: review generated method
<%-table.buildUpdateApplyModel()%>
        return dao.run {
            validate(model, updating = true)
            update(model)
        }
    }

<%_ } _%>
<%_ if (table.isRemovable) { _%>
    fun remove(<%-table.primariesByParam(true, true)%>): Long {
        // TODO: review generated method
<%_ if (table.idsColumn.length <= 1) { _%>
        if (id == null) throw BadRequestException()
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        if (id<%-(Number(i) + 1)%> == null) throw BadRequestException()
<%_ } _%>
<%_ } _%>

        val affectedRows = dao.softDelete(<%-table.primariesByParamCall()%>)
        if (affectedRows == 0) throw NotFoundException()

<%_ if (table.idsColumn.length <= 1) { _%>
        return id
<%_ } else { _%>
        return id1
<%_ } _%>
    }

<%_ } _%>
<%_ if (table.hasPersist) { _%>
    private fun <%-table.modelName%>Dao.validate(model: <%-table.modelName%>, updating: Boolean) {
<%_ for (var i in table.uniqueColumns) { var column = table.uniqueColumns[i] _%>
        model.<%-column.name%>?.also {
            if (exist<%-column.capitalizedName%>(it, <%-table.primariesByParamCall('model')%>)) {
                throw BadRequestException(context.lang.alreadyExist(context.lang["<%-table.modelName%>.<%-column.name%>"]))
            }
        }

<%_ } _%>
        if (updating) {
            if (!exist(<%-table.primariesByParamCall('model')%>)) {
                throw BadRequestException(context.lang["does_not_exist"])
            }
        } else {
            if (exist(<%-table.primariesByParamCall('model')%>)) {
                throw BadRequestException(context.lang["already_exists"])
            }
        }
    }

<%_ } _%>
}
