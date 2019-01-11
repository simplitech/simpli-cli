<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception

import br.com.simpli.model.RespException
import javax.ws.rs.core.Response

/**
 * HttpException
 * @author Simpli CLI generator
 */
open class HttpException(
    message: String,
    val status: Response.Status = Response.Status.INTERNAL_SERVER_ERROR
) : RespException(status.statusCode, message)
