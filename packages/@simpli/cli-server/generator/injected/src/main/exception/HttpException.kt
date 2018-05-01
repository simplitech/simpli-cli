<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception

import javax.ws.rs.WebApplicationException
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

open class HttpException(
        message: kotlin.String,
        status: Response.Status = Response.Status.BAD_REQUEST
) : WebApplicationException(
        Response.status(status)
                .entity(ExceptionModel(message))
                .type(MediaType.APPLICATION_JSON)
                .build()
) {

    class ExceptionModel(val message: String?)
}

