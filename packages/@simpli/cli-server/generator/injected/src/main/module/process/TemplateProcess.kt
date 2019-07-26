<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.process

import <%-packageAddress%>.dao.<%-table.modelName%>Dao
<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>
<%_ if (m2m.pivotModelName !== table.modelName) { _%>
import <%-packageAddress%>.dao.<%-m2m.pivotModelName%>Dao
<%_ } _%>
<%_ } _%>
import <%-packageAddress%>.model.collection.PageCollection
import <%-packageAddress%>.model.resource.<%-table.modelName%>
import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.exception.response.NotFoundException
import <%-packageAddress%>.wrapper.ProcessWrapper

/**
 * <%-table.modelName%> business logic
 * @author Simpli CLI generator
 */
class <%-table.modelName%>Process : ProcessWrapper() {

    lateinit var dao: <%-table.modelName%>Dao

    override fun onAssign() {
        dao = <%-table.modelName%>Dao(con)
    }

    @Throws(BadRequestException::class, NotFoundException::class)
    fun get(request: <%-table.modelName%>.GetParam): <%-table.modelName%> {
        // TODO: review generated method
<%_ if (table.idsColumn.length <= 1) { _%>
        val id = request.id ?: throw BadRequestException()
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        val id<%-(Number(i) + 1)%> = request.id<%-(Number(i) + 1)%> ?: throw BadRequestException()
<%_ } _%>
<%_ } _%>

<%_ for (var i in table.manyToMany) { var m2m = table.manyToMany[i] _%>
        val <%-m2m.pivotInstanceName%>Dao = <%-m2m.pivotModelName%>Dao(con)

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

    fun list(request: <%-table.modelName%>.ListParam): PageCollection<<%-table.modelName%>> {
        // TODO: review generated method
        val items = dao.getList(request)
        val total = dao.count(request)

        return PageCollection(items, total)
    }

<%_ if (table.hasPersist) { _%>
    /**
     * Use this to handle similarities between create and persist
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
        val <%-m2m.pivotInstanceName%>Dao = <%-m2m.pivotModelName%>Dao(con)

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

    @Throws(BadRequestException::class)
    fun create(model: <%-table.modelName%>): Long {
        // TODO: review generated method
        model.validate(false, dao, lang)

<%_ if (table.idsColumn.length <= 1) { _%>
        model.id = dao.insert(model)

        return model.id
<%_ } else { _%>
        dao.insert(model)

        return model.id1
<%_ } _%>
    }

    @Throws(BadRequestException::class)
    fun update(model: <%-table.modelName%>): Long {
        // TODO: review generated method
        model.validate(true, dao, lang)

        dao.update(model)

<%_ if (table.idsColumn.length <= 1) { _%>
        return model.id
<%_ } else { _%>
        return model.id1
<%_ } _%>
    }

<%_ } _%>
<%_ if (table.isRemovable) { _%>
    @Throws(BadRequestException::class, NotFoundException::class)
    fun remove(request: <%-table.modelName%>.GetParam): Long {
        // TODO: review generated method
<%_ if (table.idsColumn.length <= 1) { _%>
        val id = request.id ?: throw BadRequestException()
<%_ } else { _%>
<%_ for (var i in table.idsColumn) { var column = table.idsColumn[i] _%>
        val id<%-i%> = request.<%-column.name%> ?: throw BadRequestException()
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
}
