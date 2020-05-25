<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var moduleNameKebabCase = options.serverSetup.kebabCase(moduleName) _%>
<%_ var commonTables = options.serverSetup.commonTables _%>
package <%-packageAddress%>.<%-moduleName%>.router

import <%-packageAddress%>.<%-moduleName%>.context.AuthPipe
import <%-packageAddress%>.<%-moduleName%>.process.<%-table.modelName%>Process
import <%-packageAddress%>.wrapper.RouterWrapper
import <%-packageAddress%>.model.param.DefaultParam
import <%-packageAddress%>.model.param.Auth<%-table.modelName%>ListParam
import <%-packageAddress%>.model.resource.<%-table.modelName%>
import br.com.simpli.model.PageCollection
import io.swagger.v3.oas.annotations.Operation
import javax.ws.rs.BeanParam
import javax.ws.rs.DELETE
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.POST
import javax.ws.rs.PUT
import javax.ws.rs.core.MediaType

/**
 * Routing the API address into <%-table.modelName%> Process
 * @author Simpli CLI generator
 */
@Path("/<%-moduleNameKebabCase%>/<%-table.apiName%>")
@Produces(MediaType.APPLICATION_JSON)
class <%-table.modelName%>Router : RouterWrapper() {
    @GET
    @Path("<%-table.primariesBySlash()%>")
    @Operation(tags = ["<%-table.modelName%>"], summary = "Gets a instance of a given ID of <%-table.modelName%>")
    fun get<%-table.modelName%>(@BeanParam param: <%-table.hasUniqueDefaultId ? 'DefaultParam' : table.modelName%>.RequiredPathId): <%-table.modelName%> {
        // unreviewed generated method
        return AuthPipe.handle(connectionPipe, param) { context, _ ->
            <%-table.modelName%>Process(context).get(<%-table.primariesByParamCall('param')%>)
		}
    }

    @GET
    @Operation(tags = ["<%-table.modelName%>"], summary = "Lists the instances of <%-table.modelName%>")
    fun list<%-table.modelName%>(@BeanParam param: Auth<%-table.modelName%>ListParam): PageCollection<<%-table.modelName%>> {
        // unreviewed generated method
        return AuthPipe.handle(connectionPipe, param) { context, _ ->
            <%-table.modelName%>Process(context).list(param)
		}
    }

    @GET
    @Path("/export")
    @Operation(tags = ["<%-table.modelName%>"], summary = "Lists the instances of <%-table.modelName%> to export as a file")
    fun listExport<%-table.modelName%>(@BeanParam param: Auth<%-table.modelName%>ListParam): PageCollection<<%-table.modelName%>> {
        // unreviewed generated method
        return AuthPipe.handle(connectionPipe, param) { context, _ ->
            <%-table.modelName%>Process(context).list(param)
		}
    }
<%_ if (table.hasPersist) { _%>

    @POST
    @Operation(tags = ["<%-table.modelName%>"], summary = "Persists a new instance of <%-table.modelName%>. Use ID = 0 to create a new one, or ID > 0 to update a current one")
    fun persist<%-table.modelName%>(@BeanParam param: DefaultParam.Auth, model: <%-table.modelName%>): Long {
        // unreviewed generated method
        return AuthPipe.handle(transactionPipe, param) { context, _ ->
            <%-table.modelName%>Process(context).persist(model)
		}
    }
<%_ } _%>
<%_ if (table.isRemovable) { _%>

    @DELETE
    @Path("<%-table.primariesBySlash()%>")
    @Operation(tags = ["<%-table.modelName%>"], summary = "Deletes a instance of a given ID of <%-table.modelName%>")
    fun remove<%-table.modelName%>(@BeanParam param: <%-table.hasUniqueDefaultId ? 'DefaultParam' : table.modelName%>.RequiredPathId): Long {
        // unreviewed generated method
        return AuthPipe.handle(transactionPipe, param) { context, _ ->
            <%-table.modelName%>Process(context).remove(<%-table.primariesByParamCall('param')%>)
		}
    }
<%_ } _%>
}
