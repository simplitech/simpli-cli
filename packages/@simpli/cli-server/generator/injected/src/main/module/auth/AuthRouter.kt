<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.auth

import <%-packageAddress%>.<%-moduleName%>.gateway.AuthGateway
import <%-packageAddress%>.<%-moduleName%>.gateway.GuestGateway
import <%-packageAddress%>.<%-moduleName%>.request.AuthRequest
import <%-packageAddress%>.<%-moduleName%>.request.ChangePasswordRequest
import <%-packageAddress%>.<%-moduleName%>.request.RecoverPasswordRequest
import <%-packageAddress%>.<%-moduleName%>.request.ResetPasswordRequest
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
import javax.ws.rs.core.MediaType

/**
 * Routing the API address into Auth Process
 * @author Simpli CLI generator
 */
@Path("<%-moduleName%>/auth")
@Api()
@Produces(MediaType.APPLICATION_JSON)
class AuthRouter : RouterWrapper() {

    val process = AuthProcess()

    val guestGateway = GuestGateway()
    val authGateway = AuthGateway()

    @GET
    @ApiOperation(tags = ["AuthResponse"], value = "Gets the user authentication")
    fun authenticate(@BeanParam param: DefaultParam.Auth): AuthResponse {
        return connection(authGateway).route(param) { auth, _, _, _ -> auth }
    }

    @POST
    @Path("/sign-in")
    @ApiOperation(tags = ["AuthResponse"], value = "Submits the user authentication")
    fun signIn(@BeanParam param: DefaultParam, request: AuthRequest): AuthResponse {
        return connection(guestGateway).handle(process, param) {
            it.signIn(request)
        }
    }

    @POST
    @Path("/password/reset")
    @ApiOperation(tags = ["AuthResponse"], value = "Reset the password of a given account")
    fun resetPassword(@BeanParam param: DefaultParam, request: ResetPasswordRequest): Long {
        return connection(guestGateway).handle(process, param) {
			it.resetPassword(request)
		}
    }

    @POST
    @Path("/password/recover")
    @ApiOperation(tags = ["AuthResponse"], value = "Recover the password of a given hash")
    fun recoverPassword(@BeanParam param: DefaultParam, request: RecoverPasswordRequest): String {
        return connection(guestGateway).handle(process, param) {
			it.recoverPassword(request)
		}
    }

    @POST
    @Path("/password/change")
    @ApiOperation(tags = ["AuthResponse"], value = "Change the password of a given new password")
    fun changePassword(@BeanParam param: DefaultParam.Auth, request: ChangePasswordRequest): Long {
        return transaction(authGateway).handleWithAuth(process, param) { it, auth ->
			it.changePassword(request, auth)
		}
    }
}
