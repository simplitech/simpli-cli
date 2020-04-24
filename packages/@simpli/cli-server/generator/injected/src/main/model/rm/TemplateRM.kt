<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var startCase = options.serverSetup.startCase _%>
package <%-packageAddress%>.model.rm

import <%-packageAddress%>.model.resource.<%-table.modelName%>
import br.com.simpli.sql.Query
import br.com.simpli.sql.ResultBuilder
import java.sql.ResultSet

/**
 * Relational Mapping of Principal from table <%-table.name%>
 * @author Simpli CLI generator
 */
object <%-table.modelName%>RM {
<%-table.buildConstructor()-%>

<%-table.buildSelectFields()-%>

<%-table.buildFieldsToSearch()-%>

<%-table.buildOrderMap()-%>

<%-table.buildUpdateSet()-%>

<%-table.buildInsertValues()-%>
}
