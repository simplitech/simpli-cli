<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var startCase = options.serverSetup.startCase _%>
package <%-packageAddress%>.model.resource

import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.param.DefaultParam
import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.getDouble
import br.com.simpli.sql.getDoubleOrNull
import br.com.simpli.sql.getLong
import br.com.simpli.sql.getString
import br.com.simpli.sql.getLongOrNull
import br.com.simpli.sql.getBoolean
import br.com.simpli.sql.getBooleanOrNull
import br.com.simpli.sql.getTimestamp
import br.com.simpli.sql.Query
import br.com.simpli.tools.Validator
import io.swagger.v3.oas.annotations.media.Schema
import java.sql.ResultSet
import java.util.Date
import javax.ws.rs.PathParam
import javax.xml.bind.annotation.XmlRootElement

/**
 * Reference model of table <%-table.name%>
<%_ if (table.commentary) { _%>
 * Note: <%-table.commentary%>
 *
<%_ } _%>
 * @author Simpli CLI generator
 */
<%_ if (table.commentary) { _%>
@XmlRootElement
@Schema(description = "<%-table.commentary%>")
<%_ } else { _%>
@XmlRootElement
<%_ } _%>
class <%-table.modelName%>() {
<%-table.buildIdsColumns()-%>
<%-table.buildRelations()-%>
<%-table.buildCommentaryColumns()-%>
<%-table.buildRequiredAndMaxlengthAndNotDescriptionColumns()-%>
<%-table.buildRequiredAndNotMaxlengthAndNotDescriptionColumns()-%>
<%-table.buildMaxlengthAndNotRequiredAndNotDescriptionColumns()-%>
<%-table.buildSimpleColumns()-%>
<%-table.buildPasswordColumns()-%>
<%-table.buildGettersAndSetters()-%>
    fun validate(lang: LanguageHolder) {
<%-table.buildValidate()-%>
    }

<%-table.buildRequiredPathId()-%>
<%-table.buildConstructor()-%>

<%-table.buildUpdateSet()-%>

<%-table.buildInsertValues()-%>

    companion object {
<%-table.buildOrderMap()-%>
    }
}
