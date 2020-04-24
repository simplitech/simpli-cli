<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app.env

import <%-packageAddress%>.enums.Mode

/**
 * Environment Variables - Beta
 * @author Simpli CLI generator
 */
class PropsBeta : Props(Mode.BETA) {
    override val APP_DEFAULT_ORIGIN = "http://localhost:8181"
}

