<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.auth

import <%-packageAddress%>.<%-moduleName%>.context.AuthPipe
import <%-packageAddress%>.<%-moduleName%>.context.PublicPipe
import <%-packageAddress%>.<%-moduleName%>.request.AuthRequest
import <%-packageAddress%>.<%-moduleName%>.request.ChangePasswordRequest
import <%-packageAddress%>.<%-moduleName%>.request.ResetPasswordRequest
import <%-packageAddress%>.<%-moduleName%>.request.RecoverPasswordByMailRequest
import <%-packageAddress%>.<%-moduleName%>.response.AuthResponse
import <%-packageAddress%>.wrapper.RouterWrapper
import <%-packageAddress%>.param.DefaultParam
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import javax.ws.rs.BeanParam
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.GET
import javax.ws.rs.POST
import javax.ws.rs.PUT
import javax.ws.rs.core.MediaType

/**
 * Routing the API address into Auth Process
 * @author Simpli CLI generator
 */
@Api
@Path("<%-moduleName%>/auth")
@Produces(MediaType.APPLICATION_JSON)
class AuthRouter : RouterWrapper() {

    @GET
    @ApiOperation(tags = ["AuthRequest"], value = "Gets the user authentication")
    fun authenticate(@BeanParam param: DefaultParam.Auth): AuthResponse {
        return PublicPipe.handle(connectionPipe, param) { context ->
            AuthProcess(context).authenticate(param)
        }
    }

    @POST
    @ApiOperation(tags = ["AuthRequest"], value = "Submits the user authentication")
    fun signIn(@BeanParam param: DefaultParam, request: AuthRequest): AuthResponse {
        return PublicPipe.handle(connectionPipe, param) { context ->
            AuthProcess(context).signIn(request)
        }
    }

    @PUT
    @Path("/password")
    @ApiOperation(tags = ["RecoverPasswordByMailRequest"], value = "Sends an email requesting to change the password")
    fun recoverPasswordByMail(@BeanParam param: DefaultParam, request: RecoverPasswordByMailRequest): Long {
        return PublicPipe.handle(connectionPipe, param) { context ->
            AuthProcess(context).recoverPasswordByMail(request)
        }
    }

    @POST
    @Path("/password")
    @ApiOperation(tags = ["ResetPasswordRequest"], value = "Recovers the password with a given hash")
    fun resetPassword(@BeanParam param: DefaultParam, request: ResetPasswordRequest): String {
        return PublicPipe.handle(transactionPipe, param) { context ->
            AuthProcess(context).resetPassword(request)
        }
    }

    @POST
    @Path("/me/password")
    @ApiOperation(tags = ["ChangePasswordRequest"], value = "Changes the password with a given new password")
    fun changePassword(@BeanParam param: DefaultParam.Auth, request: ChangePasswordRequest): Long {
        return AuthPipe.handle(transactionPipe, param) { context, auth ->
            AuthProcess(context).changePassword(request, auth)
        }
    }
}
