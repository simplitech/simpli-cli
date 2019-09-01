<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

/**
 * Environment Variables
 * @author Simpli CLI generator
 */
object Env {
    val props = if (PropertyHelper("/maven.properties")["buildType"] != "debug") {
        EnvProduction()
    } else {
        EnvDebug()
    }
}
