<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var startCase = options.serverSetup.startCase _%>
package <%-packageAddress%>.model.resource

import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.model.param.DefaultParam
import br.com.simpli.model.LanguageHolder
import br.com.simpli.tools.Validator
import io.swagger.v3.oas.annotations.media.Schema
import java.util.Date
import javax.ws.rs.PathParam

/**
 * Reference model of table <%-table.name%>
<%_ if (table.commentary) { _%>
 * Note: <%-table.commentary%>
 *
<%_ } _%>
 * @author Simpli CLI generator
 */
<%_ if (table.commentary) { _%>
@Schema(description = "<%-table.commentary%>")
<%_ } _%>
class <%-table.modelName%> {
<%-table.buildIdsColumns()-%>
<%-table.buildRelations()-%>
<%-table.buildCommentaryColumns()-%>
<%-table.buildRequiredAndMaxlengthAndNotDescriptionColumns()-%>
<%-table.buildRequiredAndNotMaxlengthAndNotDescriptionColumns()-%>
<%-table.buildMaxlengthAndNotRequiredAndNotDescriptionColumns()-%>
<%-table.buildSimpleColumns()-%>
<%-table.buildPasswordColumns()-%>
<%-table.buildRequiredPathId()-%>
<%-table.buildGettersAndSetters()-%>
    fun validate(lang: LanguageHolder) {
<%-table.buildValidate()-%>
    }
}
