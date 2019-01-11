<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * ConflictException
 * @author Simpli CLI generator
 */
open class ConflictException(message: String? = null)
    : HttpException(message ?: "Conflict", Response.Status.CONFLICT)
