<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * BadRequestException
 * @author Simpli CLI generator
 */
open class BadRequestException(message: String? = null)
    : HttpException(message ?: "Bad Request", Response.Status.BAD_REQUEST)
