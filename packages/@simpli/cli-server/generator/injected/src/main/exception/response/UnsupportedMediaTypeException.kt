<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * UnsupportedMediaTypeException
 * @author Simpli CLI generator
 */
open class UnsupportedMediaTypeException(message: String? = null)
    : HttpException(message ?: "Unsupported Media Type", Response.Status.UNSUPPORTED_MEDIA_TYPE)
