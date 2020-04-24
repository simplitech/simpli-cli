<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.wrapper

import <%-packageAddress%>.app.Facade.Env
import <%-packageAddress%>.exception.HttpException
import br.com.simpli.sql.ReadConPipe
import br.com.simpli.sql.TransacConPipe
import org.apache.logging.log4j.LogManager
import javax.ws.rs.NotFoundException
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response
import javax.ws.rs.ext.ExceptionMapper

/**
 * Router Wrapper
 * Extended class of routers
 * @author Simpli CLI generator
 */
abstract class RouterWrapper : ExceptionMapper<Throwable> {
    val connectionPipe = ReadConPipe(Env.DS_NAME)
    val transactionPipe = TransacConPipe(Env.DS_NAME)

    companion object {
        private val logger = LogManager.getLogger(RouterWrapper::class.java)
    }

    override fun toResponse(e: Throwable): Response {
        return when (e) {
            is NotFoundException,
            is HttpException -> {
                // Logging
                logger.apply {
                    if (isDebugEnabled) {
                        debug(e.message, e)
                    } else {
                        info(e.message)
                    }
                }

                Response.status((e as? HttpException)?.status ?: Response.Status.NOT_FOUND)
                        .entity(ExceptionModel(e.message))
                        .type(MediaType.APPLICATION_JSON)
                        .build()
            }
            else -> {
                // Logging
                logger.error(e.message, e)

                val message = if (logger.isDebugEnabled && !e.message.isNullOrEmpty()) e.message else "Unexpected Error"
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity(ExceptionModel(message))
                        .type(MediaType.APPLICATION_JSON)
                        .build()
            }
        }
    }

    class ExceptionModel(val message: String?)
}
