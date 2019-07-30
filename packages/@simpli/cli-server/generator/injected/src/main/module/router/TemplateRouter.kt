<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var moduleNameKebabCase = options.serverSetup.kebabCase(moduleName) _%>
<%_ var commonTables = options.serverSetup.commonTables _%>
package <%-packageAddress%>.<%-moduleName%>.router

import <%-packageAddress%>.<%-moduleName%>.gateway.AuthGateway
import <%-packageAddress%>.<%-moduleName%>.process.<%-table.modelName%>Process
import <%-packageAddress%>.wrapper.RouterWrapper
import <%-packageAddress%>.model.collection.PageCollection
import <%-packageAddress%>.model.resource.<%-table.modelName%>
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
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
@Api
@Path("/<%-moduleNameKebabCase%>/<%-table.apiName%>")
@Produces(MediaType.APPLICATION_JSON)
class <%-table.modelName%>Router : RouterWrapper() {

    val authGateway = AuthGateway()

    @GET
    @Path("<%-table.primariesBySlash()%>")
    @ApiOperation(tags = ["<%-table.modelName%>"], value = "Gets a instance of a given ID from <%-table.modelName%>")
    fun populate(@BeanParam param: <%-table.modelName%>.GetParam): <%-table.modelName%> {
        // TODO: review generated method
        val process = <%-table.modelName%>Process()
        return connection(authGateway).handle(process, param) {
			it.get(param)
		}
    }

    @GET
    @ApiOperation(tags = ["<%-table.modelName%>"], value = "Lists the instances from <%-table.modelName%>")
    fun list(@BeanParam param: <%-table.modelName%>.ListParam): PageCollection<<%-table.modelName%>> {
        // TODO: review generated method
        val process = <%-table.modelName%>Process()
        return connection(authGateway).handle(process, param) {
			it.list(param)
		}
    }

    @GET
    @Path("/csv")
    @ApiOperation(tags = ["<%-table.modelName%>"], value = "Lists the instances from <%-table.modelName%> to use it in a CSV file")
    fun listCsv(@BeanParam param: <%-table.modelName%>.ListParam): PageCollection<<%-table.modelName%>> {
        // TODO: review generated method
        val process = <%-table.modelName%>Process()
        return connection(authGateway).handle(process, param) {
			it.list(param)
		}
    }

<%_ if (table.hasPersist) { _%>
    @POST
    @ApiOperation(tags = ["<%-table.modelName%>"], value = "Persists a new instance from <%-table.modelName%>", notes = "Use ID = 0 to create a new one, or ID > 0 to update a current one")
    fun persist(@BeanParam param: <%-table.modelName%>.PersistParam, model: <%-table.modelName%>): Long {
        // TODO: review generated method
        val process = <%-table.modelName%>Process()
        return transaction(authGateway).handle(process, param) {
			it.persist(model)
		}
    }

<%_ } _%>
<%_ if (table.isRemovable) { _%>
    @DELETE
    @Path("<%-table.primariesBySlash()%>")
    @ApiOperation(tags = ["<%-table.modelName%>"], value = "Deletes a instance of a given ID from <%-table.modelName%>")
    fun remove(@BeanParam param: <%-table.modelName%>.GetParam): Long {
        // TODO: review generated method
        val process = <%-table.modelName%>Process()
        return transaction(authGateway).handle(process, param) {
			it.remove(param)
		}
    }

<%_ } _%>
}
