<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * InternalServerErrorException
 * @author Simpli CLI generator
 */
open class InternalServerErrorException(message: String? = null)
    : HttpException(message ?: "Internal Server Error", Response.Status.INTERNAL_SERVER_ERROR)
