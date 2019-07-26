<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.wrapper

import <%-packageAddress%>.app.Env.DEBUG_MODE
import <%-packageAddress%>.app.Env.DS_NAME
import <%-packageAddress%>.exception.HttpException
import br.com.simpli.sql.ReadConPipe
import br.com.simpli.sql.TransacConPipe
import java.util.logging.Level
import java.util.logging.Logger
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response
import javax.ws.rs.ext.ExceptionMapper

/**
 * Router Wrapper
 * Extended class of routers
 * @author Simpli CLI generator
 */
abstract class RouterWrapper : ExceptionMapper<Throwable> {
    private val connectionPipe = ReadConPipe(DS_NAME)
    private val transactionPipe = TransacConPipe(DS_NAME)

    /**
     * Open the MySQL connection without rollback
     * Usually used for http GET methods
     */
    protected fun <G : GatewayWrapper> connection(gateway: G): G {
        gateway.assign(connectionPipe)
        return gateway
    }

    /**
     * Open the MySQL connection with rollback in case of an exception
     * Usually used for http POST, PUT or DELETE methods
     */
    protected fun <G : GatewayWrapper> transaction(gateway: G): G {
        gateway.assign(transactionPipe)
        return gateway
    }

    override fun toResponse(e: Throwable): Response {
        Logger.getLogger(RouterWrapper::class.java.name).log(Level.SEVERE, e.message, e)

        return when (e) {
            is HttpException -> {
                Response.status(e.status)
                        .entity(ExceptionModel(e.message))
                        .type(MediaType.APPLICATION_JSON)
                        .build()
            }
            else -> {
                val message = if (DEBUG_MODE && !e.message.isNullOrEmpty()) e.message else "Unexpected Error"
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity(ExceptionModel(message))
                        .type(MediaType.APPLICATION_JSON)
                        .build()
            }
        }
    }

    class ExceptionModel(val message: String?)
}
