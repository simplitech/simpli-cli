<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.model.filter

import java.util.Date

/**
 * <%-table.modelName%> List Filter
 * @author Simpli CLI generator
 */
interface <%-table.modelName%>ListFilter : ListFilter {
<%-table.buildFilterColumns()-%>
}
