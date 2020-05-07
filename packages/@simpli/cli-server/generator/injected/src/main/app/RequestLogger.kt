<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

import <%-packageAddress%>.app.healthcheck.HealthCheckRouter
import <%-packageAddress%>.extension.forwarded
import <%-packageAddress%>.extension.ip
import <%-packageAddress%>.extension.isFailure
import com.amazonaws.xray.AWSXRay
import com.google.gson.JsonIOException
import org.apache.logging.log4j.LogManager
import java.io.ByteArrayInputStream
import javax.servlet.http.HttpServletRequest
import javax.ws.rs.container.ContainerRequestContext
import javax.ws.rs.container.ContainerResponseContext
import javax.ws.rs.container.ContainerResponseFilter
import javax.ws.rs.core.Context
import javax.ws.rs.ext.Provider
import javax.ws.rs.ext.ReaderInterceptor
import javax.ws.rs.ext.ReaderInterceptorContext
import javax.ws.rs.container.ContainerRequestFilter

/**
 * Request Logger
 * Provides log information of all requests
 * @author Simpli CLI generator
 */
@Provider
class RequestLogger : ContainerRequestFilter, ContainerResponseFilter, ReaderInterceptor {
    companion object {
        private val logger = LogManager.getLogger(RequestLogger::class.java)
        private val requestMap = HashMap<HttpServletRequest?, RequestLog>()

        const val XRAY_METADATA_NAMESPACE = "request"
        const val XRAY_METADATA_KEY = "body"

        fun logXRayException(e: Throwable) {
            AWSXRay.getCurrentSegment()?.addException(e)
        }
    }

    @Context
    var sr: HttpServletRequest? = null

    override fun filter(request: ContainerRequestContext?) {
        requestMap[sr] = RequestLog(request, sr)
    }

    override fun filter(request: ContainerRequestContext?, response: ContainerResponseContext?) {
        requestMap.remove(sr)?.apply {
            // Health check is logged at TRACE level
            if (this.uri?.contains(HealthCheckRouter.PATH) == true) {
                logger.trace(this.toString())
            } else {
                logger.debug(this.toString())
            }

            response?.let {
                // If HTTP Status is not successful (1XX|2XX) or if logger is set to debug level or lower,
                // adds metadata to current X-Ray segment
                if (it.isFailure() || logger.isDebugEnabled) {
                    AWSXRay.getCurrentSegment()?.putMetadata(XRAY_METADATA_NAMESPACE, XRAY_METADATA_KEY, this.request)
                }
            }
        }
    }

    override fun aroundReadFrom(context: ReaderInterceptorContext?): Any? {
        if (logger.isDebugEnabled) {
            requestMap[sr]?.addRequestBody(context)
        }

        return context?.proceed()
    }

    private class RequestLog(request: ContainerRequestContext?, sr: HttpServletRequest?) {
        val uri = request?.uriInfo?.requestUri?.toString()
        // val method = sr?.method
        // val ip = sr?.ip()
        // val forwarded = sr?.forwarded()
        // val headers = request?.headers

        var request: Any? = null
            private set

        fun addRequestBody(ctx: ReaderInterceptorContext?) {
            request = ctx?.run {
                val body = inputStream.reader(Charsets.UTF_8).readLines().joinToString("\n").also {
                    inputStream = ByteArrayInputStream(it.toByteArray(Charsets.UTF_8))
                }

                try {
                    Cast.pretty.fromJson(body, Any::class.java)
                } catch (e: Exception) {
                    // If unsuccessful, returns the raw body
                    body
                }
            }
        }

        override fun toString(): String {
            return try {
                Cast.pretty.toJson(this, RequestLog::class.java)
            } catch (e: JsonIOException) {
                super.toString()
            }
        }
    }
}
