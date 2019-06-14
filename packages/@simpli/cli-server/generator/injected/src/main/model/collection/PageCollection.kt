<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.model.collection

/**
 * PageCollection
 * @author Simpli CLI generator
 */
open class PageCollection<T>(var items: List<T>, var total: Int)
