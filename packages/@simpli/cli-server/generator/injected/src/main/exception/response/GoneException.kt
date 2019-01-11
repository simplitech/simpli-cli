<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * GoneException
 * @author Simpli CLI generator
 */
open class GoneException(message: String? = null)
    : HttpException(message ?: "Gone", Response.Status.GONE)
