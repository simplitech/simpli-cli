<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * BadGatewayException
 * @author Simpli CLI generator
 */
open class BadGatewayException(message: String? = null)
    : HttpException(message ?: "Bad Gateway", Response.Status.BAD_GATEWAY)
