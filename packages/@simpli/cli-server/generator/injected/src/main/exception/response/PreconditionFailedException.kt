<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * PreconditionFailedException
 * @author Simpli CLI generator
 */
open class PreconditionFailedException(message: String? = null)
    : HttpException(message ?: "Precondition Failed", Response.Status.PRECONDITION_FAILED)
