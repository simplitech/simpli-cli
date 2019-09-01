<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

/**
 * Environment Variables - Debug
 * @author Simpli CLI generator
 */
class EnvDebug : EnvProduction() {
    override val isProduction = false
    override val detailedLog = true
    override val appDefaultOrigin = "http://localhost:8181"
}
