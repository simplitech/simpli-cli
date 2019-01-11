<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * GatewayTimeoutException
 * @author Simpli CLI generator
 */
open class GatewayTimeoutException(message: String? = null)
    : HttpException(message ?: "Gateway Timeout", Response.Status.GATEWAY_TIMEOUT)
