<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var moduleNameCapitalized = options.serverSetup.capitalizeFirstLetter(moduleName) _%>
<%_ var commonTables = options.serverSetup.commonTables _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
package <%-packageAddress%>.<%-moduleName%>

import <%-packageAddress%>.RouterWrapper
import com.simpli.model.PagedResp
import javax.ws.rs.GET
import javax.ws.rs.POST
import javax.ws.rs.DELETE
import javax.ws.rs.Path
import javax.ws.rs.PathParam
import javax.ws.rs.Produces
import javax.ws.rs.QueryParam
import javax.ws.rs.core.MediaType
import javax.ws.rs.HeaderParam
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiParam

import <%-packageAddress%>.<%-moduleName%>.process.LoginService
import <%-packageAddress%>.<%-moduleName%>.process.LoginService.LoginHolder
import <%-packageAddress%>.<%-moduleName%>.response.LoginResp
<%_ for (var i in commonTables) { var table = commonTables[i] _%>
import <%-packageAddress%>.<%-moduleName%>.process.<%-table.modelName%>Process
import <%-packageAddress%>.<%-moduleName%>.response.<%-table.modelName%>Resp
import <%-packageAddress%>.model.<%-table.modelName%>
<%_ } _%>

/**
 * Routes of <%-moduleNameCapitalized%> module
 * @author Simpli© CLI generator
 */
@Path("/<%-moduleNameCapitalized%>")
@Api(tags = arrayOf("<%-moduleNameCapitalized%>"))
@Produces(MediaType.APPLICATION_JSON)
class Router : RouterWrapper() {

    @GET
    @Path("/Auth")
    @ApiOperation(value = "Get user authentication")
    fun auth(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en-US, pt-BR")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String
    ): LoginResp {
        //TODO: review generated method
        return pipe.handle { con ->
            LoginService(con, getLang(lang), clientVersion)
                    .auth(extractToken(authorization))
        }
    }

    @POST
    @Path("/SignIn")
    @ApiOperation(value = "Submit user authentication")
    fun signIn(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en-US, pt-BR")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,

        @ApiParam(required = true)
            body: LoginHolder
    ): LoginResp {
        //TODO: review generated method
        return pipe.handle { con ->
            LoginService(con, getLang(lang), clientVersion)
                    .signIn(body.<%-accountColumn.name%>, body.<%-passwordColumn.name%>)
        }
    }

<%_ for (var i in commonTables) { var table = commonTables[i] _%>
<%_ var columns = table.primaryColumns _%>
    @GET
    @Path("/<%-table.modelName%>/<%-table.primariesBySlash()%>")
    @ApiOperation(value = "Gets <%-table.modelName%> of informed id")
    fun get<%-table.modelName%>(
<%_ for (var j in columns) { var column = columns[j] _%>
<%_ var id = columns.length <= 1 ? 'id' : column.name _%>
        @PathParam("<%-id%>") @ApiParam(required = true)
            <%-id%>: <%-column.kotlinType%><%-columns.length <= 1 ? '?' : ''%>,
<%_ } _%>

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String
    ): <%-table.modelName%>Resp {
        //TODO: review generated method
        return pipe.handle {
            con -> <%-table.modelName%>Process(con, getLang(lang), clientVersion)
                .getOne(<%-table.primariesByComma()%>, extractToken(authorization))
        }
    }

    @GET
    @Path("/<%-table.modelName%>")
    @ApiOperation(value = "List <%-table.modelName%> information")
    fun list<%-table.modelName%>(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idGrupoDoPrincipalFk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?
    ): PagedResp<<%-table.modelName%>> {
        //TODO: review generated method
        return pipe.handle {
            con -> <%-table.modelName%>Process(con, getLang(lang), clientVersion)
                .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

<%_ if (table.hasPersist) { _%>
    @POST
    @Path("/<%-table.modelName%>")
    @ApiOperation(value = "Persist a new or existing <%-table.modelName%>", notes = "1 - Informed <%-table.modelName%> have an ID editing the existing <%-table.modelName%>; 2 - Informed <%-table.modelName%> don't have an ID creating a new <%-table.modelName%>")
    fun persist<%-table.modelName%>(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            <%-table.instanceName%>: <%-table.modelName%>
    ): Long {
        //TODO: review generated method
        return pipe.handle<Long> {
            con -> <%-table.modelName%>Process(con, getLang(lang), clientVersion)
                .persist(<%-table.instanceName%>, extractToken(authorization))
        }
    }

<%_ } _%>
<%_ if (table.isRemovable) { _%>
    @DELETE
    @Path("/<%-table.modelName%>/<%-table.primariesBySlash()%>")
    @ApiOperation(value = "Deletes the <%-table.modelName%> of informed id")
    fun remove<%-table.modelName%>(
<%_ for (var j in columns) { var column = columns[j] _%>
<%_ var id = columns.length <= 1 ? 'id' : column.name _%>
        @PathParam("<%-id%>") @ApiParam(required = true)
            <%-id%>: <%-column.kotlinType%><%-columns.length <= 1 ? '?' : ''%>,
<%_ } _%>

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String
    ): Any? {
        //TODO: review generated method
        return pipe.handle<Any?> {
            con -> <%-table.modelName%>Process(con, getLang(lang), clientVersion)
                .remove(<%-table.primariesByComma()%>, extractToken(authorization))
        }
    }

<%_ } _%>
<%_ } _%>
}
