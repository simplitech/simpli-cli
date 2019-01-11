<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * ExpectationFailedException
 * @author Simpli CLI generator
 */
open class ExpectationFailedException(message: String? = null)
    : HttpException(message ?: "Expectation Failed", Response.Status.EXPECTATION_FAILED)
