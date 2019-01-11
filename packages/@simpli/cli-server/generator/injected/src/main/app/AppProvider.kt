<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

import <%-packageAddress%>.app.Cast.builder
import com.google.gson.Gson
import java.io.IOException
import javax.ws.rs.container.ContainerRequestContext
import javax.ws.rs.container.ContainerResponseContext
import javax.ws.rs.container.ContainerResponseFilter
import javax.ws.rs.ext.ContextResolver
import javax.ws.rs.ext.Provider

/**
 * App Provider
 * Provides rules of access for all requests
 * @author Simpli CLI generator
 */
@Provider
class AppProvider : ContextResolver<Gson>, ContainerResponseFilter {

    override fun getContext(type: Class<*>?): Gson {
        return builder
    }

    @Throws(IOException::class)
    override fun filter(request: ContainerRequestContext, response: ContainerResponseContext) {
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        response.headers.add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Client-Version, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
    }

}
