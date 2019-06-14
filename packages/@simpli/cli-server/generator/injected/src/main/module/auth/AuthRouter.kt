<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.auth

import <%-packageAddress%>.<%-moduleName%>.gateway.AuthGateway
import <%-packageAddress%>.<%-moduleName%>.gateway.GuestGateway
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

    val process = AuthProcess()

    val guestGateway = GuestGateway()
    val authGateway = AuthGateway()

    @GET
    @ApiOperation(tags = ["Auth"], value = "Gets the user authentication")
    fun authenticate(@BeanParam param: DefaultParam.Auth): AuthResponse {
        return connection(authGateway).route(param) { auth, _, _, _ -> auth }
    }

    @POST
    @ApiOperation(tags = ["Auth"], value = "Submits the user authentication")
    fun signIn(@BeanParam param: DefaultParam, request: AuthRequest): AuthResponse {
        return connection(guestGateway).handle(process, param) {
            it.signIn(request)
        }
    }

    @PUT
    @Path("/password")
    @ApiOperation(tags = ["Auth"], value = "Sends an email requesting to change the password")
    fun recoverPasswordByMail(@BeanParam param: DefaultParam, request: RecoverPasswordByMailRequest): Long {
        return connection(guestGateway).handle(process, param) {
            it.recoverPasswordByMail(request)
        }
    }

    @POST
    @Path("/password")
    @ApiOperation(tags = ["Auth"], value = "Recovers the password with a given hash")
    fun resetPassword(@BeanParam param: DefaultParam, request: ResetPasswordRequest): String {
        return transaction(guestGateway).handle(process, param) {
            it.resetPassword(request)
        }
    }

    @POST
    @Path("/me/password")
    @ApiOperation(tags = ["Auth"], value = "Changes the password with a given new password")
    fun changePassword(@BeanParam param: DefaultParam.Auth, request: ChangePasswordRequest): Long {
        return transaction(authGateway).handleWithAuth(process, param) { it, auth ->
            it.changePassword(request, auth)
        }
    }
}
