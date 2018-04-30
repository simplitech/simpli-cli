<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var moduleNameCapitalized = options.serverSetup.capitalizeFirstLetter(moduleName) _%>
<%_ var commonTables = options.serverSetup.commonTables _%>
package <%-packageAddress%>.<%-moduleName%>

import com.simpli.model.PagedResp
import br.com.martinlabs.usecase.RouterWrapper
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
import <%-packageAddress%>.<%-moduleName%>.LoginService.LoginHolder
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
                    .signIn(body.account, body.password)
        }
    }

<%-options.serverSetup.buildRouter()-%>
}
