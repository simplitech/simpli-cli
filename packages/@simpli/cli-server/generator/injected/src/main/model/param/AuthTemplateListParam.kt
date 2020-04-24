<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.model.param

import <%-packageAddress%>.model.filter.<%-table.modelName%>ListFilter
import io.swagger.v3.oas.annotations.media.Schema
import java.util.Date
import javax.ws.rs.QueryParam

/**
 * Authenticated <%-table.modelName%> Param
 * @author Simpli CLI generator
 */
open class Auth<%-table.modelName%>ListParam: DefaultParam.AuthPaged(), <%-table.modelName%>ListFilter {
<%-table.buildParamColumns()-%>
}
