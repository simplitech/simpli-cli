<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>

import javax.servlet.http.HttpServletRequest
import javax.ws.rs.WebApplicationException
import javax.ws.rs.container.ContainerRequestContext
import javax.ws.rs.container.ContainerResponseContext
import javax.ws.rs.container.ContainerResponseFilter
import javax.ws.rs.core.Context
import javax.ws.rs.ext.Provider
import javax.ws.rs.ext.ReaderInterceptor
import javax.ws.rs.ext.ReaderInterceptorContext
import java.io.*
import java.util.logging.Level
import java.util.logging.Logger
import java.util.stream.Collectors

@Provider
class RequestLogger : ContainerResponseFilter, ReaderInterceptor {

    @Context
    var sr: HttpServletRequest? = null

    @Throws(IOException::class)
    override fun filter(request: ContainerRequestContext,
                        response: ContainerResponseContext) {
        Logger.getLogger(RequestLogger::class.java.name).log(Level.INFO, """
            REQUEST URI: ${request.uriInfo.requestUri}
            REQUEST METHOD: ${sr?.method}
            REQUEST IP: ${sr?.remoteAddr}
            REQUEST HEADERS: ${request.headers}
            ===== END OF REQUEST =====
            """)
    }

    @Throws(IOException::class, WebApplicationException::class)
    override fun aroundReadFrom(context: ReaderInterceptorContext): Any {

        val ist = context.inputStream
        val body = BufferedReader(InputStreamReader(ist)).lines()
                .collect(Collectors.joining("\n")) // getting the body

        Logger.getLogger(RequestLogger::class.java.name).log(Level.INFO, """
            REQUEST BODY: $body
            """)

        context.inputStream = ByteArrayInputStream(body.toByteArray()) // putting the body back in, idk

        return context.proceed()
    }

}
