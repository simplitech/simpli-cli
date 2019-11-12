<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

import java.io.BufferedReader
import java.io.ByteArrayInputStream
import java.io.IOException
import java.io.InputStreamReader
import javax.servlet.http.HttpServletRequest
import javax.ws.rs.WebApplicationException
import javax.ws.rs.container.ContainerRequestContext
import javax.ws.rs.container.ContainerResponseContext
import javax.ws.rs.container.ContainerResponseFilter
import javax.ws.rs.core.Context
import javax.ws.rs.ext.Provider
import javax.ws.rs.ext.ReaderInterceptor
import javax.ws.rs.ext.ReaderInterceptorContext
import java.util.logging.Level
import java.util.logging.Logger
import java.util.stream.Collectors

/**
 * Request Logger
 * Provides log information of all requests
 * @author Simpli CLI generator
 */
@Provider
class RequestLogger : ContainerResponseFilter, ReaderInterceptor {

    @Context
    var sr: HttpServletRequest? = null

    override fun filter(request: ContainerRequestContext, response: ContainerResponseContext) {
        if (Env.props.detailedLog) {
            Logger.getLogger(RequestLogger::class.java.name).log(Level.INFO, """
            REQUEST URI: ${request.uriInfo.requestUri}
            REQUEST METHOD: ${sr?.method}
            REQUEST IP: ${sr?.remoteAddr}
            REQUEST HEADERS: ${request.headers}
            ===== END OF REQUEST =====
            """)
        }
    }

    override fun aroundReadFrom(context: ReaderInterceptorContext): Any {
        val ist = context.inputStream
        val body = BufferedReader(InputStreamReader(ist)).lines()
                .collect(Collectors.joining("\n")) // getting the body

        if (Env.props.detailedLog) {
            Logger.getLogger(RequestLogger::class.java.name).log(Level.INFO, """
            REQUEST BODY: $body
            """)
        }

        context.inputStream = ByteArrayInputStream(body.toByteArray()) // putting the body back in, idk

        return context.proceed()
    }

}
