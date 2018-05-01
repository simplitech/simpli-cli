<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.process

import <%-packageAddress%>.model.<%-table.modelName%>
import <%-packageAddress%>.<%-moduleName%>.response.<%-table.modelName%>Resp
import <%-packageAddress%>.dao.<%-table.modelName%>Dao
<%_ for (var i in table.validDistinctRelations) { var relation = table.validDistinctRelations[i] _%>
import <%-packageAddress%>.dao.<%-relation.referencedTableModelName%>Dao
<%_ if (relation.isManyToMany) { _%>
import <%-packageAddress%>.dao.<%-relation.pivot.tableModelName%>Dao
<%_ } _%>
<%_ } _%>
import <%-packageAddress%>.exception.HttpException
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import java.sql.Connection
import javax.ws.rs.core.Response

/**
 * <%-table.modelName%> business logic
 * @author Simpli© CLI generator
 */
class <%-table.modelName%>Process(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {
    private val loginS = LoginService(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<<%-table.modelName%>> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = <%-table.modelName%>Dao(con, lang)

        val list<%-table.modelName%> = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(list<%-table.modelName%>)

        if (!Strings.isNullOrEmpty(query)) {
            dao.count(query)?.let {
                count -> resp.recordsTotal = count
            }
        } else {
            dao.count()?.let{
                count -> resp.recordsTotal = count
            }
        }

        return resp
    }

    fun getOne(<%-table.primariesByParam(true)%>, token: String?): <%-table.modelName%>Resp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val <%-table.instanceName%>Dao = <%-table.modelName%>Dao(con, lang)
<%_ for (var i in table.validDistinctRelations) { var relation = table.validDistinctRelations[i] _%>
<%_ if (!relation.isManyToMany) { _%>
        val <%-relation.name%>Dao = <%-relation.referencedTableModelName%>Dao(con, lang)
<%_ } else { _%>
        val <%-table.manyToMany.crossRelationInstanceName%>Dao = <%-table.manyToMany.crossRelationModelName%>Dao(con, lang)
        val <%-table.manyToMany.pivotInstanceName%>Dao = <%-table.manyToMany.pivotModelName%>Dao(con, lang)
<%_ } _%>
<%_ } _%>

        val resp = <%-table.modelName%>Resp()

        if (<%-table.primariesByConditions()%>) {
            val <%-table.instanceName%> = <%-table.instanceName%>Dao.getOne(<%-table.primariesByComma(true)%>)
<%_ if (table.hasPivot) { _%>
            if (<%-table.instanceName%> != null) {
                <%-table.instanceName%>.<%-table.manyToMany.pivotInstanceName%> = tagPrincipalDao.list<%-table.manyToMany.crossRelationModelName%>Of<%-table.modelName%>(<%-table.idColumn.name%>)
            }
<%_ } _%>
            resp.<%-table.instanceName%> = <%-table.instanceName%>
        }

<%_ for (var i in table.validDistinctRelations) { var relation = table.validDistinctRelations[i] _%>
<%_ if (!relation.isManyToMany) { _%>
        resp.all<%-relation.referencedTableModelName%> = <%-relation.name%>Dao.list()
<%_ } else { _%>
        resp.all<%-relation.referencedTableModelName%> = <%-table.manyToMany.crossRelationInstanceName%>Dao.list()
<%_ } _%>
<%_ } _%>
<%_ if (table.validDistinctRelations.length > 0) { _%>

<%_ } _%>
        return resp
    }

<%_ if (table.hasID || table.foreignColumns.length) { _%>
    fun persist(<%-table.instanceName%>: <%-table.modelName%>, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = <%-table.modelName%>Dao(con, lang)

<%_ for (var i in table.uniqueColumns) { var column = table.uniqueColumns[i] _%>
        if (dao.exist<%-options.serverSetup.capitalizeFirstLetter(column.name)%>(<%-table.instanceName%>.<%-column.name%>, <%-table.instanceName%>.<%-table.idColumn.name%>)) {
            throw HttpException(lang.alreadyExist("<%-column.name%>"), Response.Status.NOT_ACCEPTABLE)
        }

<%_ } _%>
<%_ if (table.hasID) { _%>
        val id<%-table.modelName%>: <%-table.idColumn.kotlinType%>
        if (<%-table.instanceName%>.<%-table.idColumn.name%> > 0) {
            <%-table.instanceName%>.validate(true, lang)
            id<%-table.modelName%> = <%-table.instanceName%>.<%-table.idColumn.name%>
            
            dao.update<%-table.modelName%>(<%-table.instanceName%>)
        } else {
            <%-table.instanceName%>.validate(false, lang)
            id<%-table.modelName%> = dao.insert(<%-table.instanceName%>)
            <%-table.instanceName%>.<%-table.idColumn.name%> = id<%-table.modelName%>
        }
<%_ } else { _%>
        val id<%-table.modelName%> = <%-table.instanceName%>.<%-table.foreignColumns[0].name%>
<%_ if (table.foreignColumns.length <= 1) { _%>
        val exist = dao.exist<%-table.modelName%>(<%-table.instanceName%>.<%-table.foreignColumns[0].name%>)
<%_ } else { _%>
        val exist = dao.exist<%-table.modelName%>(<%-table.instanceName%>.<%-table.foreignColumns[0].name%>, <%-table.instanceName%>.<%-table.foreignColumns[1].name%>)
<%_ } _%>
        if (exist) {
            <%-table.instanceName%>.validate(true, lang)
            dao.update<%-table.modelName%>(<%-table.instanceName%>)
        } else {
            <%-table.instanceName%>.validate(false, lang)
            dao.insert(<%-table.instanceName%>)
        }
<%_ } _%>

<%_ if (table.hasPivot) { _%>
        val <%-table.manyToMany.pivotInstanceName%>Dao = <%-table.manyToMany.pivotModelName%>Dao(con, lang)
    
        <%-table.manyToMany.pivotInstanceName%>Dao.removeAllFrom<%-table.modelName%>(id<%-table.modelName%>)
        
        <%-table.instanceName%>.<%-table.manyToMany.pivotInstanceName%>?.let { list ->
            for (<%-table.manyToMany.crossRelationInstanceName%> in list) {
                <%-table.manyToMany.pivotInstanceName%>Dao.insert(<%-table.manyToMany.crossRelationInstanceName%>.<%-table.manyToMany.crossRelationColumnName%>, id<%-table.modelName%>)
            }
        }

<%_ } _%>
        return id<%-table.modelName%>
    }
<%_ } _%>
<%_ if (table.isRemovable) { _%>

    fun remove(<%-table.primariesByParam(true)%>, token: String?) {
        //TODO: review generated method
        loginS.allowAccess(token)
        val <%-table.instanceName%>Dao = <%-table.modelName%>Dao(con, lang)

        if (<%-table.primariesByConditions(true)%>) {
            throw HttpException(lang.cannotBeNull("id"), Response.Status.NOT_ACCEPTABLE)
        }

        <%-table.instanceName%>Dao.softDelete(<%-table.primariesByComma(true)%>)
    }
<%_ } _%>
}
