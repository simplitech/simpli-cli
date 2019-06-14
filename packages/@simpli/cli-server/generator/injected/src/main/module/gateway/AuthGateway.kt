<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.gateway

import <%-packageAddress%>.<%-moduleName%>.response.AuthResponse
import <%-packageAddress%>.<%-moduleName%>.auth.AuthProcess
import <%-packageAddress%>.enums.Lang
import <%-packageAddress%>.exception.response.UnauthorizedException
import <%-packageAddress%>.param.DefaultParam
import <%-packageAddress%>.wrapper.GatewayWrapper
import <%-packageAddress%>.wrapper.ProcessWrapper
import br.com.simpli.model.LanguageHolder
import java.sql.Connection

/**
 * Authentication Gateway
 * Responsible to control the authentication data and validates it
 * @author Simpli CLI generator
 */
open class AuthGateway : GatewayWrapper() {

    /**
     * The middleware provides a convenient mechanism for filtering HTTP requests entering your application.
     * Use this function to throw exceptions or change values according to the app conditions
     * For instance: check if the user belongs to a premium account
     */
    fun middleware(con: Connection, auth: AuthResponse, param: DefaultParam.Auth) {
        // TODO: review generated method
        val lang = getLang(param.lang)
        val clientVersion = param.clientVersion

        if (clientVersion != "w1.0.0") {
            //
        }

        when (param) {
            is DefaultParam.AuthPaged -> {
                param.query = param.query?.replace("[.,:\\-/]".toRegex(), "")
            }
        }
    }

    /**
     * Handle the HTTP Request in order to get the authentication, server connection, client language and client version
     */
    fun <T> route(
            param: DefaultParam.Auth,
            c: (auth: AuthResponse, con: Connection, lang: LanguageHolder, clientVersion: String) -> T
    ): T {
        return pipe.handle { con ->
            val language = param.lang
            val clientVersion = param.clientVersion
            val authorization = param.authorization ?: ""

            val lang = getLang(language)

            val token = extractToken(authorization) ?: throw UnauthorizedException(lang["invalid_token"])

            val authProcess = AuthProcess()
            authProcess.assign(con, lang, clientVersion)

            val auth = authProcess.auth(token)

            middleware(con, auth, param)

            c(auth, con, lang, clientVersion)
        }
    }

    /**
     * Handle the HTTP Request in order to populate a given process
     */
    fun <P : ProcessWrapper, T> handle(
            process: P,
            param: DefaultParam.Auth,
            c: (process: P) -> T
    ): T = handleWithAuth(process, param) { it, _ -> c(it) }

    /**
     * Handle the HTTP Request in order to populate a given process with authentication
     */
    fun <P : ProcessWrapper, T> handleWithAuth(
            process: P,
            param: DefaultParam.Auth,
            c: (process: P, auth: AuthResponse) -> T
    ): T {
        return route(param) { auth, con, lang, clientVersion ->
            process.assign(con, lang, clientVersion)
            c(process, auth)
        }
    }

}
