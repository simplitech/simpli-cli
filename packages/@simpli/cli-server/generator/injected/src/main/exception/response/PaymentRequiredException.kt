<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * PaymentRequiredException
 * @author Simpli CLI generator
 */
open class PaymentRequiredException(message: String? = null)
    : HttpException(message ?: "Payment Required", Response.Status.PAYMENT_REQUIRED)
