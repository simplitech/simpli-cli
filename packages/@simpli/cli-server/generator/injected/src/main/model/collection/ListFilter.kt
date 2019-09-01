<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.model.collection

/**
 * ListFilter
 * @author Simpli CLI generator
 */
interface ListFilter {
    var query: String?
    var page: Int?
    var limit: Int?
    var orderBy: String?
    var ascending: Boolean?
}
