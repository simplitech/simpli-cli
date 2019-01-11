<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.gateway

import <%-packageAddress%>.enums.Lang
import <%-packageAddress%>.param.DefaultParam
import <%-packageAddress%>.wrapper.GatewayWrapper
import <%-packageAddress%>.wrapper.ProcessWrapper
import <%-packageAddress%>.wrapper.RouterWrapper
import br.com.simpli.model.LanguageHolder
import java.sql.Connection

/**
 * Router Gateway
 * Responsible to control the data which is entering into the server
 * @author Simpli CLI generator
 */
open class GuestGateway : GatewayWrapper() {

    /**
     * The middleware provides a convenient mechanism for filtering HTTP requests entering your application.
     * Use this function to throw exceptions or change values according to the app conditions
     * For instance: check if the client version is acceptable
     */
    fun middleware(con: Connection, param: DefaultParam) {
        // TODO: review generated method
        val lang = getLang(param.lang)
        val clientVersion = param.clientVersion

        if (lang !== Lang.EN_US) {
            //
        }

        if (clientVersion !== "w1.0.0") {
            //
        }

        when(param) {
            is DefaultParam.Paged -> {
                param.query = param.query?.replace("[.,:\\-/]".toRegex(), "")
            }
        }
    }

    /**
     * Handle the HTTP Request in order to get the server connection, client language and client version
     */
    fun <T> route(
            param: DefaultParam,
            c: (con: Connection, lang: LanguageHolder, clientVersion: String) -> T
    ): T {
        return pipe.handle { con ->
            val language = param.lang
            val clientVersion = param.clientVersion

            val lang = getLang(language)

            middleware(con, param)
            c(con, lang, clientVersion)
        }
    }

    /**
     * Handle the HTTP Request in order to populate a given process
     */
    fun <P: ProcessWrapper, T> handle(
            process: P,
            param: DefaultParam,
            c: (process: P) -> T
    ): T {
        return route(param) { con, lang, clientVersion ->
            process.assign(con, lang, clientVersion)
            c(process)
        }
    }

}
