<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.enums

/**
 * ConnectionStatus enum
 * Represents the connection status of application
 * @author Simpli CLI generator
 */
enum class ConnectionStatus {
    ESTABLISHED, LOST;

    override fun toString(): String {
        return super.name.toLowerCase()
    }
}
