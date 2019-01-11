<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * LengthRequiredException
 * @author Simpli CLI generator
 */
open class LengthRequiredException(message: String? = null)
    : HttpException(message ?: "Length Required", Response.Status.LENGTH_REQUIRED)
